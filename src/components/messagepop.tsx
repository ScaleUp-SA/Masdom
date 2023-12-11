import { Chat } from "@/types";
import { Message, User } from "@prisma/client";
import React, { useState } from "react";

type Props = {
  chatMessage: Message[];
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

const MessagePop = ({ chat, user, chatMessage }: Props) => {
  return (
    <div className="w-full h-full flex flex-col py-5 gap-4">
      {chatMessage.map((message: Message) =>
        message.senderId === user?.id ? (
          <div key={message.id} className="flex justify-end">
            <div className="text-left w-max px-5">
              <p className=" bg-sky-200 p-2 rounded-t-xl rounded-bl-xl">
                {message.content}
              </p>
            </div>
          </div>
        ) : (
          <div key={message.id} className="flex justify-start">
            <div className="text-right w-max right px-5">
              <p className=" bg-green-200 p-2 rounded-t-xl rounded-br-xl ">
                {message.content}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MessagePop;
