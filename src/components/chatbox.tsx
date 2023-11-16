"use client";

import { Chat, Session } from "@/types";
import { Message } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MessagePop from "./messagepop";

type Props = { chatId?: string; session?: Session | null };

const ChatBox = ({ chatId, session }: Props) => {
  const user = session?.user;

  const [chat, setChat] = useState<Chat>();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/chat/getchat/${chatId}`);
        setChat(res.data.chat);
      } catch (error) {
        console.error("Error", error);
      }
    })();
  }, [chatId]);

  console.log(chat, "chatData");

  return (
    <>
      {!chatId ? (
        <p> please slecet Chat</p>
      ) : (
        <MessagePop chat={chat} user={user} />
      )}
    </>
  );
};

export default ChatBox;
