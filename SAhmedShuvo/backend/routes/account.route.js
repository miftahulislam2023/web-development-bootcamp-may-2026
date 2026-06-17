const express = require("express");

const accountRouter = express.Router();

const { addAccount, showAccount, balanceTransfer, deleteAccount, } = require("../controllers/account.controller");
const { checkAuthentication } = require("../middlewares/auth.middleware");

accountRouter.post("/add", checkAuthentication, addAccount);
accountRouter.get("/show", checkAuthentication, showAccount);
accountRouter.post("/transfer", checkAuthentication, balanceTransfer);
accountRouter.delete("/delete/:id", checkAuthentication, deleteAccount);


module.exports = accountRouter;
