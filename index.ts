import express from "express";
import dotenv from "dotenv";
import epnsCoreABI from "./epns_core_abi.json";
import epnsCommABI from "./epns_comm_abi.json";
import bodyParser from "body-parser";
import payload from "./payload.json";
import epnsHelper, { EPNSSettings, InfuraSettings, NetWorkSettings } from "@epnsproject/backend-sdk";
const app = express();

dotenv.config();
const networkToMonitor = "homestead";

// InfuraSettings contains setttings details on infura
const infuraSettings: InfuraSettings = {
  projectID: process.env.INFURA_PROJECT_ID!,
  projectSecret: process.env.INFURA_PROJECT_SECRET!,
};

// Network settings contains details on alchemy, infura and etherscan
const settings: NetWorkSettings = {
  alchemy: process.env.ALCHEMY_API_KEY,
  infura: infuraSettings,
  etherscan: process.env.ETHERSCAN_API_KEY,
};

// EPNSSettings settings contains details on EPNS network, contract address and contract ABI
const epnsCoreSettings: EPNSSettings = {
  network: "homestead",
  contractAddress: process.env.EPNS_CORE_CONTRACT_ADDRESS!,
  contractABI: JSON.stringify(epnsCoreABI),
};

// EPNSSettings communicator contains details on EPNS network, contract address and contract ABI
const epnsCommSettings: EPNSSettings = {
  network: "homestead",
  contractAddress: process.env.EPNS_COMMUNICATOR_CONTRACT_ADDRESS!,
  contractABI: JSON.stringify(epnsCommABI),
};

const sdk = new epnsHelper(
  networkToMonitor,
  process.env.CHANNEL_PRIVATE_KEY!,
  process.env.CHANNEL_ADDRESS!,
  settings,
  epnsCoreSettings,
  epnsCommSettings
);

app.use(bodyParser.json());
app.get("/", async (req, res) => {
  try {
    console.log("-----------EPNS Backend SDK Demo------------");
    console.log(payload);
    const result = await sdk.sendNotification(
      payload.recipient,
      payload.title,
      payload.message,
      payload.payloadTitle,
      payload.payloadMessage,
      payload.notificationType,
      payload.cta,
      payload.img!,
      payload.simulate,
      { offChain: true }
    );
    console.log(result);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

app.listen("7000", () => {
  console.log("===========================================");
  console.log("EPNS Backend SDK Demo Running at PORT: 7000");
  console.log("===========================================");
});
