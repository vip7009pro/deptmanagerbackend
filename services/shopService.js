const jwt = require("jsonwebtoken");
const moment = require("moment");
const { queryDB, asyncQuery, queryDB_New } = require("../config/database");
const { publicKey } = require("../config/env");

exports.getShopList = async (req, res) => {
  const query = ` SELECT * FROM S1 WHERE UID=@UID`;
  console.log("UID = " + req.payload_data);
  const result = await queryDB_New(query, {
    UID: req.payload_data.UID,
  });
  res.send(result);
};
exports.getShopInfo = async (req, res) => {
  const query = `  SELECT * FROM S1 WHERE UID=@UID AND SHOP_ID=@SHOP_ID     `;
  const result = await queryDB_New(query, {
    UID: req.payload_data.UID,
    SHOP_ID: req.payload_data.SHOP_ID,
  });
  res.send(result);
};
exports.addNewShop = async (req, res) => {
  const query = ` INSERT INTO S1 (UID,SHOP_NAME, SHOP_ADD, SHOP_DESCR, INS_DATE, INS_UID, UPD_DATE, UPD_UID) VALUES (@UID,@SHOP_NAME,@SHOP_ADD,@SHOP_DESCR,GETDATE(),@INS_UID,GETDATE(),@UPD_UID)`;
  const result = await queryDB_New(query, {
    UID: req.payload_data.UID,
    SHOP_NAME: req.payload_data.SHOP_NAME,
    SHOP_ADD: req.payload_data.SHOP_ADD,
    SHOP_DESCR: req.payload_data.SHOP_DESCR,
    INS_UID: req.payload_data.INS_UID,
    UPD_UID: req.payload_data.UPD_UID,
  });
  res.send(result);
};
exports.updateShopInfo = async (req, res) => {
  const query = ` UPDATE S1 SET SHOP_NAME=@SHOP_NAME, SHOP_ADD=@SHOP_ADD, SHOP_DESCR=@SHOP_DESCR, UPD_DATE=GETDATE(), UPD_UID=@UPD_UID WHERE UID=@UID AND SHOP_ID=@SHOP_ID `;
  const result = await queryDB_New(query, {
    SHOP_NAME: req.payload_data.SHOP_NAME,
    SHOP_ADD: req.payload_data.SHOP_ADD,
    SHOP_DESCR: req.payload_data.SHOP_DESCR,
    UPD_UID: req.payload_data.UPD_UID,
    UID: req.payload_data.UID,
    SHOP_ID: req.payload_data.SHOP_ID,
  });
  res.send(result);
};
exports.deleteShop = async (req, res) => {
  const query = `DELETE FROM S1 WHERE UID=@UID AND SHOP_ID=@SHOP_ID`;
  const result = await queryDB_New(query, {
    UID: req.payload_data.UID,
    SHOP_ID: req.payload_data.SHOP_ID,
  });
  res.send(result);
};

exports.checklogin = (req, res) => {
  res.send({ tk_status: "OK", data: req.payload_data });
};
exports.logout = (req, res) => {
  res.cookie("token", "reset");
  res.send({ tk_status: "ok", message: "Logged out" });
};
