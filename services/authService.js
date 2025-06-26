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
exports.login2 = async (req, res, DATA) => {
  let username = DATA.EMAIL;
  let password = DATA.PWD;
  var loginResult = false;
  let maxLoginAttempt = 3;
  let queryCheckLoginAttempt = `SELECT * FROM U1 WHERE EMAIL=@EMAIL`;
  let queryIncreaseLoginAttempt = `UPDATE U1 SET LOGIN_ATTEMPT = LOGIN_ATTEMPT + 1 WHERE EMAIL = @EMAIL`;
  let queryResetLoginAttempt = `UPDATE U1 SET LOGIN_ATTEMPT = 0 WHERE EMAIL = @EMAIL`;
  let resultCheckLoginAttempt = await queryDB_New(queryCheckLoginAttempt, {
    EMAIL: username,
  });
  if (
    resultCheckLoginAttempt.tk_status === "OK" &&
    resultCheckLoginAttempt.data.length > 0
  ) {
    console.log(
      "login attempt: " + resultCheckLoginAttempt.data[0].LOGIN_ATTEMPT
    );
    if (resultCheckLoginAttempt.data[0].LOGIN_ATTEMPT >= maxLoginAttempt) {
      let lastOnlineDateTime = moment(
        moment.utc(resultCheckLoginAttempt.data[0].ONLINE_DATETIME)
      );
      let now = moment.utc(moment().format("YYYY-MM-DD HH:mm:ss"));
      let diffMinutes = now.diff(lastOnlineDateTime, "minutes");
      if (diffMinutes < 5) {
        loginResult = false;
      } else {
        await queryDB_New(queryResetLoginAttempt, {
          EMAIL: username,
        });
        loginResult = true;
      }
    } else {
      await queryDB_New(queryIncreaseLoginAttempt, {
        EMAIL: username,
      });
      loginResult = true;
    }
  }
  
    
  
 
    const query = `SELECT * FROM U1 WHERE EMAIL=@EMAIL AND PWD=@PWD`;
    const result = await queryDB_New(query, {
      EMAIL: username,
      PWD: password  ,
    });

    if(result.tk_status === "OK" && result.data.length > 0) {
      await queryDB_New(queryResetLoginAttempt, {
        EMAIL: username,
      });

      const token = jwt.sign(
        { payload: JSON.stringify(result.data) },
        "nguyenvanhung",
        { expiresIn: "24h" }
      );
      res.cookie("token", token);
      res.send({
        tk_status: "OK",
        token_content: token,
        data: [result],
        publicKey: publicKey,
      });
    } else {
      res.send({ tk_status: "ng", message: "Invalid credentials" });
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
exports.login_after_google2 = async (req, res, DATA) => {
  let username = DATA.EMAIL;
  let uid = DATA.UID;
    const query = `SELECT * FROM U1 WHERE EMAIL=@EMAIL AND UID=@UID`;
    const result = await queryDB_New(query, {
      EMAIL: username,
      UID: uid,
    });

    if(result.tk_status !== "NG" && result.data.length > 0) {     

      const token = jwt.sign(
        { payload: JSON.stringify(result.data) },
        "nguyenvanhung",
        { expiresIn: "24h" }
      );
      res.cookie("token", token);
      res.send({
        tk_status: "OK",
        token_content: token,
        data: [result],
        publicKey: publicKey,
      });
    } else {
      res.send({ tk_status: "ng", message: "Invalid credentials" });
    }
 
};

exports.checklogin = (req, res) => {
  console.log('vaoday')
  res.send({ tk_status: "OK", data: req.payload_data });
};
exports.logout = (req, res) => {
  res.cookie("token", "reset");
  res.send({ tk_status: "OK", message: "Logged out" });
};
