import { Conversation, Message, User } from "@prisma/client";

export type IFullMessage = Message & {
  sender: User;
  seen: User[];
};

export type IFullConversation = Conversation & {
  users: User[];
  messages: IFullMessage[];
};
