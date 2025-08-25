const jwt = require("jsonwebtoken");
const moment = require("moment");
const { queryDB, asyncQuery, queryDB_New } = require("../config/database");
const { publicKey } = require("../config/env");
exports.login = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    SELECT * FROM U1 WHERE EMAIL='${DATA.EMAIL}' AND PWD ='${DATA.PWD}'
  `;
  console.log(setpdQuery);
  //console.log(setpdQuery);
  checkkq = await queryDB(setpdQuery);
  loginResult = checkkq;
  //console.log("KET QUA LOGIN = " + loginResult);
  if (loginResult.tk_status != "NG") {
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
};
exports.login_after_google = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    SELECT * FROM U1 WHERE EMAIL='${DATA.EMAIL}' AND UID ='${DATA.UID}'
  `;
  console.log(setpdQuery);
  //console.log(setpdQuery);
  checkkq = await queryDB(setpdQuery);
  loginResult = checkkq;
  //console.log("KET QUA LOGIN = " + loginResult);
  if (loginResult.tk_status != "NG") {
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
};
exports.signup = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    INSERT INTO U1 (UID,EMAIL,PWD, USERNAME,USE_YN,INS_DATE, INS_UID, UPD_DATE, UPD_UID) VALUES (@UID,@EMAIL,@PWD,@EMAIL,'Y',GETDATE(),@UID,GETDATE(),@UID)             
    `;
  console.log(setpdQuery);
  checkkq = await queryDB(setpdQuery,{
    UID: DATA.UID,
    EMAIL: DATA.EMAIL,
    PWD: DATA.PWD,    
  });
  //console.log(checkkq);
  res.send(checkkq);
};

exports.checklogin = (req, res) => {
  console.log('vaoday')
  res.send({ tk_status: "OK", data: req.payload_data });
};
exports.logout = (req, res) => {
  res.cookie("token", "reset");
  res.send({ tk_status: "OK", message: "Logged out" });
};
