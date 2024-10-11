var sql = require("mssql");
var jwt = require("jsonwebtoken");
const moment = require("moment");
const { existsSync } = require("fs");
const fs = require("fs");
require("dotenv").config();
const fetch = require('node-fetch');
const { list } = require("node-windows");
let CURRENT_API_URL = 'https://script.google.com/macros/s/AKfycbyD_LRqVLETu8IvuiqDSsbItdmzRw3p_q9gCv12UOer0V-5OnqtbJvKjK86bfgGbUM1NA/exec'
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
exports.openConnection = function () {
  sql.connect(config);
}
function isNumber(str) {
  return /^[0-9]+$/.test(str) && str.length == 4;
}
const queryDB = async (query) => {
  let kq = "";
  try {
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
  } catch (err) {
    ////console.log(err);
    kq = { tk_status: "NG", message: err + " " };
  }
  return kq;
};
exports.checklogin_index = function (req, res, next) {
  try {
    var token = req.cookies.token;
    if (token === undefined)
      token =
        req.body.DATA.token_string === undefined
          ? req.body.token_string
          : req.body.DATA.token_string;
    var decoded = jwt.verify(token, "nguyenvanhung");
    var payload_json = decoded.payload.data[0];
    req.payload_data = payload_json;
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
    req.payload_data = payload_json[0];
    res.redirect("/");
    next();
  } catch (err) {
    next();
  }
};
exports.process_api = function async(req, res) {
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
            SELECT * FROM U1 WHERE EMAIL='${DATA.EMAIL}' AND PWD ='${DATA.PWD}'
          `;
          console.log(setpdQuery);
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
      case "login_after_google":
        (async () => {
          let DATA = qr["DATA"];
          let checkkq = "OK";
          let setpdQuery = `
            SELECT * FROM U1 WHERE EMAIL='${DATA.EMAIL}' AND UID ='${DATA.UID}'
          `;
          console.log(setpdQuery);
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
      case "getShopList":
        (async () => {
          let DATA = qr["DATA"];
          //console.log(DATA);           
          let checkkq = "OK";
          let setpdQuery = `
            SELECT * FROM S1 WHERE UID='${req.payload_data.UID}'           
            `;
          //console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          //console.log(checkkq);
          res.send(checkkq);
        })();
        break;
      case "getShopInfo":
        (async () => {
          let DATA = qr["DATA"];
          //console.log(DATA);           
          let checkkq = "OK";
          let setpdQuery = `
            SELECT * FROM S1 WHERE UID='${req.payload_data.UID}' AND SHOP_ID='${DATA.SHOP_ID}'           
            `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          //console.log(checkkq);
          res.send(checkkq);
        })();
        break;
      case "updateShopInfo":
        (async () => {
          let DATA = qr["DATA"];
          //console.log(DATA);           
          let checkkq = "OK";
          let setpdQuery = `
            UPDATE S1 SET SHOP_NAME=N'${DATA.SHOP_NAME}', SHOP_ADD=N'${DATA.SHOP_ADD}', SHOP_DESCR=N'${DATA.SHOP_DESCR}', UPD_DATE=GETDATE(), UPD_UID='${req.payload_data.UID}' WHERE UID='${req.payload_data.UID}' AND SHOP_ID='${DATA.SHOP_ID}'           
            `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          //console.log(checkkq);
          res.send(checkkq);
        })();
        break;
      case "addNewShop":
        (async () => {
          let DATA = qr["DATA"];
          //console.log(DATA);           
          let checkkq = "OK";
          let setpdQuery = `
            INSERT INTO S1 (UID,SHOP_NAME, SHOP_ADD, SHOP_DESCR, INS_DATE, INS_UID, UPD_DATE, UPD_UID) VALUES ('${req.payload_data.UID}',N'${DATA.SHOP_NAME}',N'${DATA.SHOP_ADD}',N'${DATA.SHOP_DESCR}',GETDATE(),'${req.payload_data.UID}',GETDATE(),'${req.payload_data.UID}')
            `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          //console.log(checkkq);
          res.send(checkkq);
        })();
        break;
      case "addvendor":
        (async () => {
          let DATA = qr["DATA"];
          //console.log(DATA);           
          let checkkq = "OK";
          let setpdQuery = `
            INSERT INTO V1 (SHOP_ID, VENDOR_CODE, VENDOR_NAME, VENDOR_ADD, VENDOR_PHONE, INS_DATE, INS_UID, UPD_DATE, UPD_UID)
            VALUES (             
              '${DATA.SHOP_ID}',
              '${DATA.VENDOR_CODE}',
              N'${DATA.VENDOR_NAME}',
              N'${DATA.VENDOR_ADD}',
              '${DATA.VENDOR_PHONE}',
              GETDATE(),
              '${req.payload_data.UID}',
              GETDATE(),
              '${req.payload_data.UID}'
            )
            `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          //console.log(checkkq);
          res.send(checkkq);
        })();
        break;
      //get vendor list
      case "getvendorlist":
        (async () => {
          let DATA = qr["DATA"];
          //console.log(DATA);           
          let checkkq = "OK";
          let setpdQuery = `
            SELECT * FROM V1 WHERE SHOP_ID='${DATA.SHOP_ID}'           
            `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          //console.log(checkkq);
          res.send(checkkq);
        })();
        break;

        //addNewProduct
      case "addNewProduct":
        (async () => {
          let DATA = qr["DATA"];
          //console.log(DATA);           
          let checkkq = "OK";
          let setpdQuery = `
            INSERT INTO P1 (SHOP_ID, PROD_CODE, PROD_NAME, PROD_PRICE, PROD_IMG, PROD_DESCR, CAT_ID, INS_DATE, INS_UID, UPD_DATE, UPD_UID)
            VALUES ('${DATA.SHOP_ID}', '${DATA.PROD_CODE}', N'${DATA.PROD_NAME}', ${DATA.PROD_PRICE}, '${DATA.PROD_IMG}', N'${DATA.PROD_DESCR}', '${DATA.CAT_ID}',  GETDATE(), '${req.payload_data.UID}', GETDATE(), '${req.payload_data.UID}')  
            `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          //console.log(checkkq);
          res.send(checkkq);
        })();
        break;  
      case "getProductList":
        (async () => {
          let DATA = qr["DATA"];
          //console.log(DATA);           
          let checkkq = "OK";
          let setpdQuery = `
            SELECT * FROM P1 WHERE SHOP_ID = '${DATA.SHOP_ID}'
            `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          //console.log(checkkq);
          res.send(checkkq);
        })();
        break;  
      case "addNewCustomer":
        (async () => {
          let DATA = qr["DATA"];
          let checkkq = "OK";
          let setpdQuery = `
            INSERT INTO C1 (SHOP_ID, CUS_NAME, CUS_PHONE, CUS_EMAIL, CUS_ADD, CUS_LOC, CUST_CD, INS_DATE, INS_UID, UPD_DATE, UPD_UID)
            VALUES ('${DATA.SHOP_ID}', N'${DATA.CUS_NAME}', '${DATA.CUS_PHONE}', '${DATA.CUS_EMAIL}', N'${DATA.CUS_ADD}', '${DATA.CUS_LOC}', '${DATA.CUST_CD}', GETDATE(), '${req.payload_data.UID}', GETDATE(), '${req.payload_data.UID}')
          `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          res.send(checkkq);
        })();
        break;
      case "getCustomerList":
        (async () => {
          let DATA = qr["DATA"];
          let checkkq = "OK";
          let setpdQuery = `
            SELECT * FROM C1 WHERE SHOP_ID = '${DATA.SHOP_ID}'
          `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          res.send(checkkq);
        })();
        break;
      case "getOrderList":
        (async () => {
          let DATA = qr["DATA"];
          let checkkq = "OK";
          let setpdQuery = `
            SELECT K1.*, C1.CUS_NAME, P1.PROD_NAME FROM K1 
            LEFT JOIN C1 ON (C1.SHOP_ID = K1.SHOP_ID AND C1.CUS_ID = K1.CUS_ID AND C1.CUST_CD = K1.CUST_CD)
            LEFT JOIN P1 ON (P1.SHOP_ID = K1.SHOP_ID AND P1.PROD_ID = K1.PROD_ID AND P1.PROD_CODE = K1.PROD_CODE)
            WHERE K1.SHOP_ID = '${DATA.SHOP_ID}'
            ORDER BY K1.INS_DATE DESC 
          `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          res.send(checkkq);
        })();
        break;
      case "addNewOrder":
        (async () => {
          let DATA = qr["DATA"];
          let checkkq = "OK";
          let setpdQuery = `
            INSERT INTO K1 (SHOP_ID, PROD_ID, CUS_ID, PO_NO, PO_QTY, PROD_PRICE, REMARK, INS_DATE, INS_UID, UPD_DATE, UPD_UID, PROD_CODE, CUST_CD)
            VALUES ('${DATA.SHOP_ID}', '${DATA.PROD_ID}', '${DATA.CUS_ID}', '${DATA.PO_NO}', ${DATA.PO_QTY}, ${DATA.PROD_PRICE}, '${DATA.REMARK}', GETDATE(), '${req.payload_data.UID}', GETDATE(), '${req.payload_data.UID}', '${DATA.PROD_CODE}', '${DATA.CUST_CD}')
          `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          res.send(checkkq);
        })();
        break;
      case "addNewInvoice":
        (async () => {
          let DATA = qr["DATA"];
          let checkkq = "OK";
          let setpdQuery = `
            INSERT INTO K2 (INVOICE_NO, SHOP_ID, PROD_ID, CUS_ID, PROD_CODE, CUST_CD, PO_NO, INVOICE_QTY, PROD_PRICE, REMARK, INS_DATE, INS_UID, UPD_DATE, UPD_UID)
            VALUES ('${DATA.INVOICE_NO}', '${DATA.SHOP_ID}', '${DATA.PROD_ID}', '${DATA.CUS_ID}', '${DATA.PROD_CODE}', '${DATA.CUST_CD}', '${DATA.PO_NO}', ${DATA.INVOICE_QTY}, ${DATA.PROD_PRICE}, '${DATA.REMARK}', GETDATE(), '${req.payload_data.UID}', GETDATE(), '${req.payload_data.UID}')
          `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
          res.send(checkkq);
        })();
        break;
      case "getInvoiceList":
        (async () => {
          let DATA = qr["DATA"];
          let checkkq = "OK";
          let setpdQuery = `
            SELECT K2.*, C1.CUS_NAME, P1.PROD_NAME FROM K2 
            LEFT JOIN C1 ON (C1.SHOP_ID = K2.SHOP_ID AND C1.CUS_ID = K2.CUS_ID AND C1.CUST_CD = K2.CUST_CD)
            LEFT JOIN P1 ON (P1.SHOP_ID = K2.SHOP_ID AND P1.PROD_ID = K2.PROD_ID AND P1.PROD_CODE = K2.PROD_CODE)
            WHERE K2.SHOP_ID = '${DATA.SHOP_ID}'
            ORDER BY K2.INS_DATE DESC 
          `;
          console.log(setpdQuery);
          checkkq = await queryDB(setpdQuery);
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
