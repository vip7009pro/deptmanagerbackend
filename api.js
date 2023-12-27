var sql = require("mssql");
var jwt = require("jsonwebtoken");
const moment = require("moment");
const { existsSync } = require("fs");
const fs = require("fs");
require("dotenv").config();
const fetch =require('node-fetch');
let CURRENT_API_URL ='https://script.google.com/macros/s/AKfycbyD_LRqVLETu8IvuiqDSsbItdmzRw3p_q9gCv12UOer0V-5OnqtbJvKjK86bfgGbUM1NA/exec'
function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  trustServerCertificate: true, 
  requestTimeout: 300000, 
};
exports.openConnection = function() {
   sql.connect(config);   
}
function isNumber(str) {
  return /^[0-9]+$/.test(str) && str.length == 4;
}
const queryDB = async (query) => {
  let kq = "";
  try {
    //await sql.connect(config);    
    //await sql.connect('Server=192.168.1.2,5005;Database=CMS_VINA;User Id=sa;Password=*11021201$; MultipleActiveResultSets=True; Encrypt=false');   
    const result = await sql.query(query);   
    if (result.rowsAffected[0] > 0) {
      if (result.recordset) {
        kq = { tk_status: "OK", data: result.recordset };
      } else {
        kq = { tk_status: "OK", message: "Modify data thanh cong" };
      }
    } else {
      kq = { tk_status: "NG", message: "Không có dòng dữ liệu nào" };
    }
    //await sql.close();
  } catch (err) {
    ////console.log(err);
    kq = { tk_status: "NG", message: err + " " };
  }
  return kq;
};
exports.checklogin_index = function (req, res, next) {
  ////console.log("bam login ma cung loi?");
  try {
    ////console.log("token client la: " + req.cookies.token);
    var token = req.cookies.token;
    //console.log('token= ' + token);
    //console.log("req", req);
    if (token === undefined)
      token =
        req.body.DATA.token_string === undefined
          ? req.body.token_string
          : req.body.DATA.token_string;
    //console.log('req', req);
    console.log('token',token);
    var decoded = jwt.verify(token, "nguyenvanhung");
    //console.log('decoded',decoded.payload.data[0]);
    //console.log(decoded);
    //console.log(decoded["exp"]);
    var payload_json = decoded.payload.data[0];
    //console.log('payload_json',payload_json);
    //console.log(payload_json);
    //console.log(payload_json[0]);
    ////console.log('Cookie client = ' + req.cookies.token);
    req.payload_data = payload_json;
    console.log('payload_json',payload_json);
    if (payload_json.USE_YN === 'N') {
      req.coloiko = "coloi";
    } else {
      req.coloiko = "kocoloi";
    }
    next();
  } catch (err) {
    console.log("Loi check login index = " + err + " ");
    req.coloiko = "coloi";
    next();
  }
};
exports.checklogin_index_update = function (req, res, next) {
  ////console.log("bam login ma cung loi?");
  try {
    req.coloiko = "kocoloi";
    next();
  } catch (err) {
    console.log("Loi check login index = " + err + " ");
    req.coloiko = "coloi";
    next();
  }
};
exports.checklogin_login = function (req, res, next) {
  try {
    console.log("token client la: " + req.cookies.token);
    var token = req.cookies.token;
    var decoded = jwt.verify(token, "nguyenvanhung");
    console.log("token= " + token);
    let payload_json = JSON.parse(decoded["payload"]);
    ////console.log(payload_json[0]);
    ////console.log('Cookie client = ' + req.cookies.token);
    req.payload_data = payload_json[0];
    //console.log("Di qua check login-login");
    res.redirect("/");
    next();
  } catch (err) {
    //console.log('Chua dang nhap nen fai ve day ' + err + ' ');
    next();
  }
};
exports.process_api = function async (req, res) {
  ////console.log(req.files.file);
  //let nhanvien = req.payload_data['EMPL_NO'];
  var qr = req.body;
  let rightnow = new Date().toLocaleString();
   /* if(req.payload_data['EMPL_NO']!== undefined) console.log(req.payload_data['EMPL_NO']); */
  console.log(moment().format("YYYY-MM-DD HH:mm:ss") + ":" + qr["command"]);
  if (
    1 /* qr["command"] ==='login' || req.payload_data["EMPL_NO"]==='NHU1903' */
  ) {
    switch (qr["command"]) {       
      case "login":
        (async () => {
          let DATA = qr["DATA"];
          let checkkq = "OK";
          let setpdQuery = `
            SELECT * FROM U1 WHERE EMAIL='${DATA.EMAIL}' AND UID ='${DATA.UID}'
          `;
          console.log(DATA.EMAIL);
          console.log(DATA.UID);
          //console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          loginResult = checkkq;
            //console.log("KET QUA LOGIN = " + loginResult);
            if (loginResult.tk_status != 'NG') {
              var token = jwt.sign({ payload: loginResult }, "nguyenvanhung", {
                expiresIn: 3600 * 24 * 100000,
              });
              res.cookie("token", token);
              ////console.log(token);
              res.send({
                tk_status: "OK",
                token_content: token,
                data: [loginResult],
              });
              //console.log('login thanh cong');
            } else {
              res.send({ tk_status: "ng", token_content: token });
              console.log({ tk_status: "ng", token_content: token });
              //console.log('login that bai');
            }                         
        })();                                                           
        break;      
        case "signup":
          (async () => {
            let DATA = qr["DATA"];
            //console.log(DATA);           
            let checkkq = "OK";   
            let setpdQuery = `
            INSERT INTO U1 (UID,EMAIL,PWD, USERNAME,USE_YN,INS_DATE, INS_UID, UPD_DATE, UPD_UID) VALUES ('${DATA.UID}','${DATA.EMAIL}','${DATA.PWD}','${DATA.EMAIL}','Y',GETDATE(),'${DATA.UID}',GETDATE(),'${DATA.UID}')             
            `;
            console.log(setpdQuery);
            checkkq = await queryDB(setpdQuery);
            //console.log(checkkq);
            res.send(checkkq);                  
          })();                                                           
          break;  
      default:        //console.log(qr['command']);
        res.send({ tk_status: "OK", data: req.payload_data });
    }
  } else {
    res.send({
      tk_status: "NG",
      message: "Bạn không có quyền truy cập sub server",
    });
  }
};
