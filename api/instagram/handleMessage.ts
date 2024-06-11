import getAndSend from "./getAndSend";
import { InstClient, InstMessage, Message } from "./types";

type HandleMessageProps = {
  client: InstClient;
  instMessage: InstMessage;
}

const HISTORY: Record<string, Message[]> = {}

const handleMessage = async ({
  client,
  instMessage,
}: HandleMessageProps) => {
  const isMessageValid = instMessage.message.item_type === "text" && instMessage.message.text.length > 2

  if (!isMessageValid) {
    return null;
  }

  const currentTime = new Date().getTime();
  const messageTimestamp = parseInt(instMessage.message.timestamp.toString()) / 1000;

  if ((currentTime - messageTimestamp) / 1000 >= 20) {
    return null;
  }

  const { username: fromuser } = await client.user.info(
    instMessage.message.user_id.toString()
  );

  // Ignore system messages
  debugger
  console.log('fromuser', fromuser)
  console.log('process.env.IG_username', process.env.IG_USERNAME)
  if (fromuser == process.env.IG_USERNAME) return null;
  
  const message: Message = {
    id: instMessage.message.item_id,
    text: `From ${fromuser}: ${instMessage.message.text}`,
    from: fromuser,
  }

  HISTORY[instMessage.message.thread_id] = HISTORY[instMessage.message.thread_id] || []
  HISTORY[instMessage.message.thread_id].push(message)

  await getAndSend({
    client,
    thread: instMessage.message.thread_id,
    allMessages: HISTORY[instMessage.message.thread_id],
  });
}

export default handleMessage