const db = require("../models");
const Wallet = db.wallet;

// Retrieve all Wallets from the database.
exports.findByNetwork = (req, res) => {
  const network = req.query.network;

  Wallet.find({ network: network.toLowerCase() })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving wallets."
      });
    });
};
