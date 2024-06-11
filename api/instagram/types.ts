import { MessageSyncMessageWrapper, IgApiClientRealtime } from "instagram_mqtt";

export type Message = {
  text: string
  id: string
  from: string
};

export type InstMessage = MessageSyncMessageWrapper
export type InstClient = IgApiClientRealtime