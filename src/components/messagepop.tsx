import { Chat } from "@/types";
import { Message, User } from "@prisma/client";
import React from "react";

type Props = {
  chat?: Chat;
  user?:
    | {
        name?: string | undefined;
        email: string;
        image?: string | undefined;
        username: string;
        isAdmin: boolean;
        id: string;
      }
    | undefined;
};

const MessagePop = ({ chat, user }: Props) => {
  return (
    <div className="w-full justify-between h-full">
      {chat?.messages?.map((message: Message) =>
        message.senderId === user?.id ? (
          <div key={message.id} className="text-right my-10">
            <p className=" bg-slate-100 p-2 rounded-md">{message.content}</p>
          </div>
        ) : (
          <div key={message.id} className="text-left my-10">
            <p className=" bg-slate-200 p-2 rounded-md">{message.content}</p>
          </div>
        )
      )}
    </div>
  );
};

export default MessagePop;
