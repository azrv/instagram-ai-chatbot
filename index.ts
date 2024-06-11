import "dotenv/config";
import * as fs from "fs";
import config from "./config.json";

import {
  login,
  handleMessage
} from "./api/instagram";

import { clientHandle, intervalChecks } from "./util";

const client = clientHandle(() => login({ client }));

const main = async () => {
  intervalChecks({ prompt: config.prompt });

  let isLogin: string;
  try {
    isLogin = fs.readFileSync("./login.json", "utf-8");
  } catch {
    fs.writeFileSync("./login.json", "");
  }

  if (!isLogin) {
    await login({ client }).catch(() => { });
  }

  if (isLogin) {
    await client.state.deserialize(JSON.parse(isLogin));
  }

  console.log(`Watching for messages. (${config.waitTime} seconds)`);

  client.realtime.on("message", async (instMessage) => {
    await handleMessage({
      client,
      instMessage,
    });
  });

  await client.realtime.connect({
    irisData: await client.feed.directInbox().request(),
  })
};

main();
