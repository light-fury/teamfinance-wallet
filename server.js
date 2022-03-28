require('dotenv').config()

const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Team Finance application." });
});

require("./app/routes/wallet.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const Wallet = db.wallet;

const fetchTeamFinance = async (chainId, skip) => {
  try {
    const response = await axios.get(`https://team-finance-backend-origdfl2wq-uc.a.run.app/api/app/explorer/search?chainId=0x${chainId.toString(16)}&skip=${skip}`);
    if (response && response.data) {
      return response.data.data;
    }
  } catch (error) {
    //
  }
  return {
    pagedData: [],
    totalCount: 0
  };
};

const manageNewTokens = async (tokenList) => {
  try {
    for (let index = 0; index < tokenList.length; index++) {
      const element = tokenList[index];
      if (!element.token || !element.token.tokenAddress || !element.token.chainId) {
        continue;
      }
      try {
        const res = await Wallet.findOne({ token: element.token.tokenAddress, network: element.token.chainId });
        if (res) {
          // wallet exist
        } else {
          const wallet = new Wallet({
            token: element.token.tokenAddress,
            network: element.token.chainId
          });
        
          await wallet.save();
        }
      } catch (err) {
        //
      }
    }
  } catch (error) {
    //
  }
};

const fetchLatestTokenList = async () => {
  let chains = [0x1, 0x38];
  for (let index = 0; index < chains.length; index++) {
    const chainId = chains[index];
    let skip = 0;
    while (1) {
      const res = await fetchTeamFinance(chainId, skip);
      await manageNewTokens(res.pagedData);
      skip += 15;
      if (res.totalCount <= skip) {
        break;
      }
    }
  }
};
// fetchLatestTokenList();

cron.schedule('0 */3 * * *', () => {
  logger.info('Trigger fetchLatestTokenList');
  fetchLatestTokenList();
});
