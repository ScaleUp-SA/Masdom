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
  console.log(chatMessage);

  const testChatMessage = [1, 2, 3, 4];
  const [sender, setSender] = useState(true);

  return (
    <div className="w-full h-full relative py-5">
      {chatMessage.map((message: Message) =>
        message.senderId === user?.id ? (
          <div
            key={message.id}
            className="text-right w-max absolute right-0 px-5"
          >
            <p className=" bg-green-200 p-2 rounded-t-xl rounded-bl-xl">
              {message.content}
            </p>
          </div>
        ) : (
          <div
            key={message.id}
            className="text-left my-14 w-max absolute left-0 px-5"
          >
            <p className=" bg-sky-200 p-2 rounded-t-xl rounded-br-xl">
              {message.content}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default MessagePop;
