import apn from "@parse/node-apn";
import { config } from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: path.resolve(__dirname, "../.env") });

const prodOptions: apn.ProviderOptions = {
  token: {
    key: process.env.APN_KEY!,
    keyId: process.env.APN_KEY_ID!,
    teamId: process.env.APPLE_TEAM_ID!,
  },
  production: true,
};

const sandBoxOptions: apn.ProviderOptions = {
  token: {
    key: process.env.APN_KEY!,
    keyId: process.env.APN_KEY_ID!,
    teamId: process.env.APPLE_TEAM_ID!,
  },
  production: false,
};

export const apnProdProvider = new apn.Provider(prodOptions);
export const apnSandboxProvider = new apn.Provider(sandBoxOptions);

export const providers = {
  prod: apnProdProvider,
  sandbox: apnSandboxProvider,
};
