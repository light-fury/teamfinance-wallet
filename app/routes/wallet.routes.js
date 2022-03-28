module.exports = app => {
  const wallet = require("../controllers/wallet.controller.js");

  var router = require("express").Router();

  // Retrieve all Wallets
  router.get("/", wallet.findByNetwork);

  app.use("/api/wallet", router);
};
