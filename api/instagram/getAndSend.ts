import { IgApiClientRealtime } from "instagram_mqtt";
import { getResponse } from "../openai";

import { loadData, saveData } from "../../util";
import sendMessage from "./sendMessage";
import { Message } from "./types";

interface GetAndSendProps {
  client: IgApiClientRealtime;
  thread: string;
  allMessages: Message[];
}

const getAndSend = async ({
  client,
  thread,
  allMessages
}: GetAndSendProps) => {
  const messageIds = allMessages.map((message) => message.id);

  let messagesCombined = "";

  allMessages.forEach((message, index) => {
    const last = index === messageIds.length - 1;

    messagesCombined += message.text + (!last ? ", " : "");
  });

  console.log(
    `\nGenerating response for compiled messages: \n${messagesCombined}`
  );

  const { messages } = loadData();

  messages.push({
    role: "user",
    content: messagesCombined,
  });

  const response = await getResponse({ messages: messages });

  messages.push({
    role: "assistant",
    content: response,
  });

  console.log(`\nSending response: \n${response}.`);

  saveData({ messages: messages, lastTimestamp: new Date().getTime() });

  await sendMessage({
    client: client,
    thread: thread,
    message: response,
  });

  return true;
};

export default getAndSend;
