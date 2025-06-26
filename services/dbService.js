const moment = require("moment");
const { login, login_after_google, checklogin, logout } = require("./authService");
const { getShopList, getShopInfo, addNewShop, updateShopInfo, deleteShop } = require("./shopService");

const commandHandlers = {
  login,
  login_after_google,
  checklogin,
  logout,
  getShopList,
  getShopInfo,
  addNewShop,
  updateShopInfo,
  deleteShop,

  
};
exports.processApi = async (req, res) => {
  const qr = req.body;
  const { command, DATA } = qr;
  console.log(moment().format('YYYY-MM-DD HH:mm:ss'), command);

  // Kiểm tra command có tồn tại không
  const handler = commandHandlers[command];
  if (!handler) {
    return res.send({ tk_status: "NG", message: `Command '${command}' not supported` });
  }
  try {
    if(req.coloiko === "coloi"){
      return res.send({ tk_status: "NG", message: `Token not valid` });
    }
    await handler(req, res, DATA);
  } catch (error) {
    console.log(`Error processing ${command}:`, error);
    res.send({ tk_status: "ng", message: "Internal server error" });
  }
};