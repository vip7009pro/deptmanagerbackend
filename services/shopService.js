const jwt = require("jsonwebtoken");
const moment = require("moment");
const { queryDB, asyncQuery, queryDB_New } = require("../config/database");
const { publicKey } = require("../config/env");
const fs = require("fs");

exports.getShopList = async (req, res, DATA) => {
  const query = ` SELECT * FROM S1 WHERE UID=@UID`;
  console.log("UID = " + req.payload_data.UID);
  const result = await queryDB_New(query, {
    UID: req.payload_data.UID,
  });
  res.send(result);
};
exports.getShopInfo = async (req, res, DATA) => {
  const query = `  SELECT * FROM S1 WHERE UID=@UID AND SHOP_ID=@SHOP_ID     `;
  const result = await queryDB_New(query, {
    UID: req.payload_data.UID,
    SHOP_ID: req.payload_data.SHOP_ID,
  });
  res.send(result);
};
exports.addNewShop = async (req, res, DATA) => {
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
exports.updateShopInfo = async (req, res, DATA) => {
  const query = ` UPDATE S1 SET SHOP_NAME=@SHOP_NAME, SHOP_ADD=@SHOP_ADD, SHOP_DESCR=@SHOP_DESCR, UPD_DATE=GETDATE(), UPD_UID=@UPD_UID WHERE UID=@UID AND SHOP_ID=@SHOP_ID `;
  const result = await queryDB_New(query, {
    SHOP_NAME: DATA.SHOP_NAME,
    SHOP_ADD: DATA.SHOP_ADD,
    SHOP_DESCR: DATA.SHOP_DESCR,
    UPD_UID: req.payload_data.UPD_UID,
    UID: req.payload_data.UID,
    SHOP_ID: req.payload_data.SHOP_ID,
  });
  res.send(result);
};
exports.deleteShop = async (req, res, DATA) => {
  const query = `DELETE FROM S1 WHERE UID=@UID AND SHOP_ID=@SHOP_ID`;
  const result = await queryDB_New(query, {
    UID: req.payload_data.UID,
    SHOP_ID: req.payload_data.SHOP_ID,
  });
  res.send(result);
};
exports.addvendor = async (req, res, DATA) => {
  const query = ` INSERT INTO V1 (SHOP_ID, VENDOR_CODE, VENDOR_NAME, VENDOR_ADD, VENDOR_PHONE, INS_DATE, INS_UID, UPD_DATE, UPD_UID)
  VALUES (              
    @SHOP_ID,
    @VENDOR_CODE,
    @VENDOR_NAME,
    @VENDOR_ADD,
    @VENDOR_PHONE,
    GETDATE(),
    @INS_UID,
    GETDATE(),
    @UPD_UID
  )
  `;
  const result = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
    VENDOR_CODE: DATA.VENDOR_CODE,
    VENDOR_NAME: DATA.VENDOR_NAME,
    VENDOR_ADD: DATA.VENDOR_ADD,
    VENDOR_PHONE: DATA.VENDOR_PHONE,
    INS_UID: req.payload_data.UID,
    UPD_UID: req.payload_data.UID,
  });
  res.send(result);
};

exports.getvendorlist = async (req, res, DATA) => {
  const query = ` SELECT * FROM V1 WHERE SHOP_ID=@SHOP_ID`;
  const result = await queryDB_New(query, {
    SHOP_ID: req.payload_data.SHOP_ID,
  });
  res.send(result);
};
exports.addNewProduct = async (req, res, DATA) => {
  const query = ` INSERT INTO P1 (SHOP_ID, PROD_CODE, PROD_NAME, PROD_PRICE, PROD_IMG, PROD_DESCR, CAT_ID,CAT_CODE, INS_DATE, INS_UID, UPD_DATE, UPD_UID)
  VALUES (              
    @SHOP_ID,
    @PROD_CODE,
    @PROD_NAME,
    @PROD_PRICE,
    @PROD_IMG,
    @PROD_DESCR,
    @CAT_ID,
    @CAT_CODE,
    GETDATE(),
    @INS_UID,
    GETDATE(),
    @UPD_UID
  )
  `;
  const result = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
    PROD_CODE: DATA.PROD_CODE,
    PROD_NAME: DATA.PROD_NAME,
    PROD_PRICE: DATA.PROD_PRICE,
    PROD_IMG: DATA.PROD_IMG,
    PROD_DESCR: DATA.PROD_DESCR,
    CAT_ID: DATA.CAT_ID,
    CAT_CODE: DATA.CAT_CODE,
    INS_UID: req.payload_data.UID,
    UPD_UID: req.payload_data.UID,
  });
  res.send(result);
};

exports.getproductlist = async (req, res, DATA) => {
  const query = ` SELECT * FROM P1 WHERE SHOP_ID=@SHOP_ID`;
  const result = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
  });
  res.send(result);
};
exports.addNewCustomer = async (req, res, DATA) => {
  const query = ` INSERT INTO C1 (SHOP_ID, CUS_NAME, CUS_PHONE, CUS_EMAIL, CUS_ADD, CUS_LOC, CUST_CD, INS_DATE, INS_UID, UPD_DATE, UPD_UID)
  VALUES (              
    @SHOP_ID,
    @CUS_NAME,
    @CUS_PHONE,
    @CUS_EMAIL,
    @CUS_ADD,
    @CUS_LOC,
    @CUST_CD,
    GETDATE(),
    @INS_UID,
    GETDATE(),
    @UPD_UID
  )
  `;
  const result = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
    CUS_NAME: DATA.CUS_NAME,
    CUS_PHONE: DATA.CUS_PHONE,
    CUS_EMAIL: DATA.CUS_EMAIL,
    CUS_ADD: DATA.CUS_ADD,
    CUS_LOC: DATA.CUS_LOC,
    CUST_CD: DATA.CUST_CD,
    INS_UID: req.payload_data.UID,
    UPD_UID: req.payload_data.UID,
  });
  res.send(result);
};
exports.getCustomerList = async (req, res, DATA) => {
  const query = ` SELECT * FROM C1 WHERE SHOP_ID=@SHOP_ID`;
  const result = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
  });
  res.send(result);
};  
exports.addNewOrder = async (req, res, DATA) => {
  const query = ` INSERT INTO K1 (SHOP_ID, PROD_ID, CUS_ID, PO_NO, PO_QTY, PROD_PRICE, REMARK, INS_DATE, INS_UID, UPD_DATE, UPD_UID, PROD_CODE, CUST_CD)
  VALUES (              
    @SHOP_ID,
    @PROD_ID,
    @CUS_ID,
    @PO_NO,
    @PO_QTY,
    @PROD_PRICE,
    @REMARK,
    GETDATE(),
    @INS_UID,
    GETDATE(),
    @UPD_UID,
    @PROD_CODE,
    @CUST_CD
  )
  `;
  const result = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
    PROD_ID: DATA.PROD_ID,
    CUS_ID: DATA.CUS_ID,
    PO_NO: DATA.PO_NO,
    PO_QTY: DATA.PO_QTY,
    PROD_PRICE: DATA.PROD_PRICE,
    REMARK: DATA.REMARK,
    INS_UID: req.payload_data.UID,
    UPD_UID: req.payload_data.UID,
    PROD_CODE: DATA.PROD_CODE,
    CUST_CD: DATA.CUST_CD,
  });
  res.send(result);
};  

exports.getOrderList = async (req, res, DATA) => {
  let checkkq = "OK";
  let condition = `WHERE K1.SHOP_ID = @SHOP_ID`;
  if (DATA.PO_NO) {
    condition += ` AND K1.PO_NO = @PO_NO`;
  }
  if(DATA.JUST_PO_BALANCE === true) {
    condition += ` AND K1.PO_QTY - ISNULL((SELECT SUM(K2.INVOICE_QTY) FROM K2 WHERE K2.SHOP_ID = K1.SHOP_ID AND K2.PO_NO = K1.PO_NO AND K2.PROD_CODE = K1.PROD_CODE), 0) > 0`;
  } 
  let setpdQuery = `
    SELECT K1.*, C1.CUS_NAME, isnull(P1.PROD_NAME, '') AS PROD_NAME,
    ISNULL((SELECT SUM(K2.INVOICE_QTY) FROM K2 WHERE K2.SHOP_ID = K1.SHOP_ID AND K2.PO_NO = K1.PO_NO AND K2.PROD_CODE = K1.PROD_CODE), 0) AS DELIVERED_QTY,
    K1.PO_QTY - ISNULL((SELECT SUM(K2.INVOICE_QTY) FROM K2 WHERE K2.SHOP_ID = K1.SHOP_ID AND K2.PO_NO = K1.PO_NO AND K2.PROD_CODE = K1.PROD_CODE), 0) AS BALANCE_QTY
    FROM K1 
    LEFT JOIN C1 ON (C1.SHOP_ID = K1.SHOP_ID AND C1.CUS_ID = K1.CUS_ID AND C1.CUST_CD = K1.CUST_CD)
    LEFT JOIN P1 ON (P1.SHOP_ID = K1.SHOP_ID AND P1.PROD_ID = K1.PROD_ID AND P1.PROD_CODE = K1.PROD_CODE)
    ${condition}
    ORDER BY K1.INS_DATE DESC
  `;
  console.log(setpdQuery);
  checkkq = await queryDB_New(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
    PO_NO: DATA.PO_NO,
    JUST_PO_BALANCE: DATA.JUST_PO_BALANCE,
  });
  res.send(checkkq);
};




exports.addNewInvoice = async (req, res, DATA) => {
  const query = ` INSERT INTO K2 (INVOICE_NO, SHOP_ID, PROD_ID, CUS_ID, PROD_CODE, CUST_CD, PO_NO, INVOICE_QTY, PROD_PRICE, REMARK, INS_DATE, INS_UID, UPD_DATE, UPD_UID)
  VALUES (@INVOICE_NO, @SHOP_ID, @PROD_ID, @CUS_ID, @PROD_CODE, @CUST_CD, @PO_NO, @INVOICE_QTY, @PROD_PRICE, @REMARK, GETDATE(), @INS_UID, GETDATE(), @UPD_UID)
`;
console.log(query);
checkkq = await queryDB_New(query, {
  INVOICE_NO: DATA.INVOICE_NO,
  SHOP_ID: DATA.SHOP_ID,
  PROD_ID: DATA.PROD_ID,
  CUS_ID: DATA.CUS_ID,
  PROD_CODE: DATA.PROD_CODE,
  CUST_CD: DATA.CUST_CD,
  PO_NO: DATA.PO_NO,
  INVOICE_QTY: DATA.INVOICE_QTY,
  PROD_PRICE: DATA.PROD_PRICE,
  REMARK: DATA.REMARK,
  INS_UID: req.payload_data.UID,
  UPD_UID: req.payload_data.UID,
});
res.send(checkkq); 
  
};

exports.getInvoiceList = async (req, res, DATA) => {
  let checkkq = "OK";
  let condition = `WHERE K2.SHOP_ID = @SHOP_ID`;
  if (DATA.PROD_ID) {
    condition += ` AND K2.PROD_ID = @PROD_ID`;
  }
  let setpdQuery = `
    SELECT K2.*, C1.CUS_NAME, isnull(P1.PROD_NAME, '') AS PROD_NAME FROM K2 
    LEFT JOIN C1 ON (C1.SHOP_ID = K2.SHOP_ID AND C1.CUS_ID = K2.CUS_ID AND C1.CUST_CD = K2.CUST_CD)
    LEFT JOIN P1 ON (P1.SHOP_ID = K2.SHOP_ID AND P1.PROD_ID = K2.PROD_ID AND P1.PROD_CODE = K2.PROD_CODE)
    ${condition}
    ORDER BY K2.INS_DATE DESC
  `;
  console.log(setpdQuery);
  checkkq = await queryDB_New(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
    PROD_ID: DATA.PROD_ID,
  });
  res.send(checkkq);
};

exports.updateInvoice = async (req, res, DATA) => {
  const query = ` UPDATE K2 SET INVOICE_QTY = @INVOICE_QTY, PROD_PRICE = @PROD_PRICE, REMARK = @REMARK, UPD_DATE = GETDATE(), UPD_UID = @UPD_UID WHERE INVOICE_NO = @INVOICE_NO AND SHOP_ID = @SHOP_ID AND PROD_ID = @PROD_ID AND CUS_ID = @CUS_ID AND PROD_CODE = @PROD_CODE AND CUST_CD = @CUST_CD AND PO_NO = @PO_NO`;
  console.log(query);
  checkkq = await queryDB_New(query, {
    INVOICE_NO: DATA.INVOICE_NO,
    SHOP_ID: DATA.SHOP_ID,
    PROD_ID: DATA.PROD_ID,
    CUS_ID: DATA.CUS_ID,
    PROD_CODE: DATA.PROD_CODE,
    CUST_CD: DATA.CUST_CD,
    PO_NO: DATA.PO_NO,
    INVOICE_QTY: DATA.INVOICE_QTY,
    PROD_PRICE: DATA.PROD_PRICE,
    REMARK: DATA.REMARK,
    UPD_UID: req.payload_data.UID,
  });
  res.send(checkkq);
};

exports.deleteInvoice = async (req, res, DATA) => {
  const query = ` DELETE FROM K2 WHERE SHOP_ID = @SHOP_ID AND INVOICE_NO = @INVOICE_NO`;
  console.log(query);
  checkkq = await queryDB_New(query, {
    INVOICE_NO: DATA.INVOICE_NO,
    SHOP_ID: DATA.SHOP_ID,
  });
  res.send(checkkq);
};
exports.editProduct = async (req, res, DATA) => {
  const query = ` UPDATE P1 SET PROD_NAME = @PROD_NAME, PROD_PRICE = @PROD_PRICE, PROD_DESCR = @PROD_DESCR, CAT_ID = @CAT_ID, CAT_CODE = @CAT_CODE, UPD_DATE = GETDATE(), UPD_UID = @UPD_UID WHERE SHOP_ID = @SHOP_ID AND PROD_CODE = @PROD_CODE`;
  console.log(query);
  checkkq = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
    PROD_CODE: DATA.PROD_CODE,
    PROD_NAME: DATA.PROD_NAME,
    PROD_PRICE: DATA.PROD_PRICE,
    PROD_DESCR: DATA.PROD_DESCR,
    CAT_ID: DATA.CAT_ID,
    CAT_CODE: DATA.CAT_CODE,
    UPD_UID: req.payload_data.UID,
  });
  res.send(checkkq);
};

exports.updateProductImage = async (req, res, DATA) => {
  const query = `  UPDATE P1 SET PROD_IMG = @PROD_IMG WHERE SHOP_ID = @SHOP_ID AND PROD_CODE = @PROD_CODE`;
  console.log(query);
  checkkq = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
    PROD_CODE: DATA.PROD_CODE,
    PROD_IMG: DATA.PROD_IMG,
  });
  res.send(checkkq);
};

exports.deleteProduct = async (req, res, DATA) => {
  const query = ` DELETE FROM P1 WHERE SHOP_ID = @SHOP_ID AND PROD_CODE = @PROD_CODE`;
  console.log(query);
  checkkq = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
    PROD_CODE: DATA.PROD_CODE,
  });
  res.send(checkkq);
};

exports.deleteProductImage = async (req, res, DATA) => {
 let checkkq = "OK";
  let setpdQuery = `
    UPDATE P1 SET PROD_IMG = '' WHERE SHOP_ID = @SHOP_ID AND PROD_CODE = @PROD_CODE
  `;
  console.log(setpdQuery);
  let filenameArray = DATA.PROD_IMG.split(',');
  for (let i = 0; i < filenameArray.length; i++) {
    let filepath = DESTINATION_FOlDER + 'product_images\\' + DATA.SHOP_ID + '_' + DATA.PROD_CODE + '_' + filenameArray[i]+'.jpg';
    console.log(filepath);  
    fs.rm(filepath, (error) => {
      console.log("Loi dong 390:" + error);
    //res.send({ tk_status: "NG", message: "Upload file thất bại: " + error });
  });
  }
  checkkq = await queryDB_New(setpdQuery, {
  SHOP_ID: DATA.SHOP_ID,
  PROD_CODE: DATA.PROD_CODE,
  });
  res.send(checkkq);  
};

exports.inputWarehouse = async (req, res, DATA) => {
  const query = ` INSERT INTO W1 (SHOP_ID, PROD_ID, PROD_QTY, PROD_STATUS, INS_DATE, INS_UID, UPD_DATE, UPD_UID, PROD_CODE, VENDOR_CODE, BEP)
  VALUES (@SHOP_ID, @PROD_ID, @PROD_QTY, @PROD_STATUS, GETDATE(), @INS_UID, GETDATE(), @UPD_UID, @PROD_CODE, @VENDOR_CODE, @BEP)`;
  console.log(query);
  checkkq = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
    PROD_ID: DATA.PROD_ID,
    PROD_QTY: DATA.PROD_QTY,
    PROD_STATUS: DATA.PROD_STATUS,
    INS_UID: req.payload_data.UID,
    UPD_UID: req.payload_data.UID,
    PROD_CODE: DATA.PROD_CODE,
    VENDOR_CODE: DATA.VENDOR_CODE,
    BEP: DATA.BEP,
  });
  res.send(checkkq);
};  


exports.outputWarehouse = async (req, res, DATA) => {
  const query = ` INSERT INTO W2 (SHOP_ID, PROD_ID, PROD_QTY, CUS_ID, PROD_CODE, CUST_CD, INS_DATE, INS_UID, UPD_DATE, UPD_UID, WH_IN_ID, INVOICE_NO, OUT_TYPE)
  VALUES (@SHOP_ID, @PROD_ID, @PROD_QTY, @CUS_ID, @PROD_CODE, @CUST_CD, GETDATE(), @INS_UID, GETDATE(), @UPD_UID, @WH_IN_ID, @INVOICE_NO, @OUT_TYPE)`;
  console.log(query);
  checkkq = await queryDB_New(query, {
    SHOP_ID: DATA.SHOP_ID,
    PROD_ID: DATA.PROD_ID,
    PROD_QTY: DATA.PROD_QTY,
    CUS_ID: DATA.CUS_ID,
    PROD_CODE: DATA.PROD_CODE,
    CUST_CD: DATA.CUST_CD,
    INS_UID: req.payload_data.UID,
    UPD_UID: req.payload_data.UID,
    WH_IN_ID: DATA.WH_IN_ID,
    INVOICE_NO: DATA.INVOICE_NO,
    OUT_TYPE: DATA.OUT_TYPE,
  });
  res.send(checkkq);
};

exports.getWarehouseInputHistory = async (req, res, DATA) => {
  let checkkq = "OK";
          let condition = `WHERE W1.SHOP_ID = @SHOP_ID`;
          if (DATA.PROD_CODE) {
            condition += ` AND W1.PROD_CODE = @PROD_CODE`;
          }
          if (DATA.VENDOR_CODE) {
            condition += ` AND W1.VENDOR_CODE = @VENDOR_CODE`;
          } 
          if (DATA.PROD_STATUS) {
            condition += ` AND W1.PROD_STATUS = @PROD_STATUS`;
          } 
          let setpdQuery = `
            SELECT W1.*,  P1.PROD_NAME, P1.PROD_DESCR, P1.PROD_IMG, V1.VENDOR_NAME, 
                   ISNULL(W2.PROD_QTY, 0) AS OUTPUT_QTY, 
                   (W1.PROD_QTY - ISNULL(W2.PROD_QTY, 0)) AS STOCK_QTY  
            FROM W1
            LEFT JOIN P1 ON P1.SHOP_ID = W1.SHOP_ID AND P1.PROD_CODE = W1.PROD_CODE
            LEFT JOIN V1 ON V1.SHOP_ID = W1.SHOP_ID AND V1.VENDOR_CODE = W1.VENDOR_CODE
            LEFT JOIN (
                SELECT SHOP_ID, WH_IN_ID, PROD_CODE, SUM(PROD_QTY) AS PROD_QTY
                FROM W2
                GROUP BY SHOP_ID, WH_IN_ID, PROD_CODE
            ) AS W2 ON W2.SHOP_ID = W1.SHOP_ID AND W2.WH_IN_ID = W1.WH_IN_ID AND W2.PROD_CODE = W1.PROD_CODE
            ${condition}  ORDER BY W1.INS_DATE DESC
          `;  
          console.log(setpdQuery);
          checkkq = await queryDB_New(setpdQuery, {
            SHOP_ID: DATA.SHOP_ID,
            PROD_CODE: DATA.PROD_CODE,
            VENDOR_CODE: DATA.VENDOR_CODE,
            PROD_STATUS: DATA.PROD_STATUS,
          });
          res.send(checkkq);
};

exports.getWarehouseOutputHistory = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    SELECT W2.*,  P1.PROD_NAME,P1.PROD_DESCR, P1.PROD_IMG, C1.CUS_NAME FROM W2
    LEFT JOIN P1 ON P1.SHOP_ID = W2.SHOP_ID AND P1.PROD_CODE = W2.PROD_CODE
    LEFT JOIN C1 ON C1.SHOP_ID = W2.SHOP_ID AND C1.CUS_ID = W2.CUS_ID
    WHERE W2.SHOP_ID = @SHOP_ID
  `;    
  console.log(setpdQuery);
  checkkq = await queryDB_New(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
  });
  res.send(checkkq);
};
exports.getProductStock = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
   SELECT P1.PROD_ID, P1.PROD_CODE, P1.PROD_NAME, P1.PROD_PRICE, P1.PROD_IMG, P1.PROD_DESCR, P1.CAT_ID, P1.INS_DATE, P1.INS_UID, P1.UPD_DATE, P1.UPD_UID, 
            ISNULL((SELECT SUM(W1.PROD_QTY) FROM W1 WHERE W1.SHOP_ID = P1.SHOP_ID AND W1.PROD_CODE = P1.PROD_CODE), 0) AS INPUT_QTY,
            ISNULL((SELECT SUM(W2.PROD_QTY) FROM W2 WHERE W2.SHOP_ID = P1.SHOP_ID AND W2.PROD_CODE = P1.PROD_CODE), 0) AS OUTPUT_QTY,
            ISNULL((SELECT SUM(W1.PROD_QTY) FROM W1 WHERE W1.SHOP_ID = P1.SHOP_ID AND W1.PROD_CODE = P1.PROD_CODE), 0) - ISNULL((SELECT SUM(W2.PROD_QTY) FROM W2 WHERE W2.SHOP_ID = P1.SHOP_ID AND W2.PROD_CODE = P1.PROD_CODE), 0) AS STOCK_QTY
            FROM P1 WHERE P1.SHOP_ID = @SHOP_ID
  `;    
  console.log(setpdQuery);
  checkkq = await queryDB_New(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
  });
  res.send(checkkq);
};

exports.getTodayPOQtyAndAmount = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    SELECT ISNULL(SUM(K1.PO_QTY), 0) AS PO_QTY, ISNULL(SUM(K1.PO_QTY * K1.PROD_PRICE), 0) AS PO_AMOUNT
    FROM K1 WHERE K1.SHOP_ID = @SHOP_ID AND K1.INS_DATE >= @INS_DATE AND K1.INS_DATE < @INS_DATE
  `;    
  console.log(setpdQuery);
  checkkq = await queryDB_New(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
    INS_DATE: moment.utc().format('YYYY-MM-DD'),
  });
  res.send(checkkq);
};

exports.getTodayInvoiceQtyAndAmount = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    SELECT ISNULL(SUM(K2.INVOICE_QTY), 0) AS INVOICE_QTY, ISNULL(SUM(K2.INVOICE_QTY * K2.PROD_PRICE), 0) AS INVOICE_AMOUNT
    FROM K2 WHERE K2.SHOP_ID = @SHOP_ID AND K2.INS_DATE >= @INS_DATE AND K2.INS_DATE < @INS_DATE
  `;    
  console.log(setpdQuery);
  checkkq = await queryDB_New(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
    INS_DATE: moment.utc().format('YYYY-MM-DD'),
  });
  res.send(checkkq);
};

exports.getCategoryList = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    SELECT * FROM P2 WHERE P2.SHOP_ID = @SHOP_ID
  `;    
  console.log(setpdQuery);
  checkkq = await queryDB_New(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
  });
  res.send(checkkq);
};
exports.addNewCategory = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    INSERT INTO P2 (SHOP_ID, CAT_CODE, CAT_NAME, INS_DATE, INS_UID, UPD_DATE, UPD_UID)
    VALUES (@SHOP_ID, @CAT_CODE, @CAT_NAME, GETDATE(), @INS_UID, GETDATE(), @UPD_UID)
  `;  
  console.log(setpdQuery);
  let params = {
    SHOP_ID: DATA.SHOP_ID,
    CAT_CODE: DATA.CAT_CODE,
    CAT_NAME: DATA.CAT_NAME,
    INS_UID: req.payload_data.UID,
    UPD_UID: req.payload_data.UID,
  }
  console.log(params)
  checkkq = await queryDB(setpdQuery, params);
  res.send(checkkq);        
};

exports.updateCategory = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    UPDATE P2 SET CAT_CODE = @CAT_CODE, CAT_NAME = @CAT_NAME WHERE SHOP_ID = @SHOP_ID AND CAT_CODE = @CAT_CODE
  `;  
  console.log(setpdQuery);
  checkkq = await queryDB(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
    CAT_CODE: DATA.CAT_CODE,
    CAT_NAME: DATA.CAT_NAME,
  });
  res.send(checkkq);   
};

exports.deleteCategory = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    DELETE FROM P2 WHERE SHOP_ID = @SHOP_ID AND CAT_CODE = @CAT_CODE
  `;    
  console.log(setpdQuery);
  checkkq = await queryDB(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
    CAT_CODE: DATA.CAT_CODE,
  });
  res.send(checkkq);   
};
exports.updateVendor = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    UPDATE V1 SET VENDOR_CODE = @VENDOR_CODE, VENDOR_NAME = @VENDOR_NAME, VENDOR_PHONE = @VENDOR_PHONE, VENDOR_ADD = @VENDOR_ADD WHERE SHOP_ID = @SHOP_ID AND VENDOR_CODE = @VENDOR_CODE
  `;  
  console.log(setpdQuery);
  checkkq = await queryDB(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
    VENDOR_CODE: DATA.VENDOR_CODE,
    VENDOR_NAME: DATA.VENDOR_NAME,
    VENDOR_PHONE: DATA.VENDOR_PHONE,
    VENDOR_ADD: DATA.VENDOR_ADD,
  });
  res.send(checkkq);   
};
exports.deleteVendor = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    DELETE FROM V1 WHERE SHOP_ID = @SHOP_ID AND VENDOR_CODE = @VENDOR_CODE
  `;    
  console.log(setpdQuery);
  checkkq = await queryDB(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
    VENDOR_CODE: DATA.VENDOR_CODE,
  });
  res.send(checkkq);   
};

exports.updateCustomer = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    UPDATE C1 SET CUS_NAME = @CUS_NAME, CUS_PHONE = @CUS_PHONE, CUS_ADD = @CUS_ADD, CUS_LOC = @CUS_LOC, UPD_DATE = GETDATE(), UPD_UID = @UPD_UID WHERE SHOP_ID = @SHOP_ID AND CUS_ID = @CUS_ID
  `;  
  console.log(setpdQuery);
  checkkq = await queryDB(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
    CUS_ID: DATA.CUS_ID,
    CUS_NAME: DATA.CUS_NAME,
    CUS_PHONE: DATA.CUS_PHONE,
    CUS_ADD: DATA.CUS_ADD,
    CUS_LOC: DATA.CUS_LOC,
    UPD_UID: req.payload_data.UID,
  });
  res.send(checkkq);
};

exports.deleteCustomer = async (req, res, DATA) => {
  let checkkq = "OK";
  let setpdQuery = `
    DELETE FROM C1 WHERE SHOP_ID = @SHOP_ID AND CUS_ID = @CUS_ID
  `;    
  console.log(setpdQuery);
  checkkq = await queryDB(setpdQuery, {
    SHOP_ID: DATA.SHOP_ID,
    CUS_ID: DATA.CUS_ID,
  });
  res.send(checkkq);   
};  

exports.checklogin = (req, res) => {
  res.send({ tk_status: "OK", data: req.payload_data });
};
exports.logout = (req, res) => {
  res.cookie("token", "reset");
  res.send({ tk_status: "ok", message: "Logged out" });
};
