"use client";

import { Chat, Session } from "@/types";
import axios from "axios";
import React, { ReactEventHandler, useEffect, useState } from "react";
import MessagePop from "./messagepop";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "./ui/use-toast";

type Props = { chatId?: string; session?: Session | null };

const ChatBox = ({ chatId, session }: Props) => {
  const user = session?.user;

  const { toast } = useToast();
  const [chat, setChat] = useState<Chat>();
  const [messageData, setMessageData] = useState({
    sender: "",
    content: "",
    chatId: "",
  });

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

  const textareaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!user?.id || !chatId) {
      return toast({
        title: "something went wrong",
        variant: "destructive",
      });
    }
    setMessageData((prev) => {
      return { ...prev, content: e.target.value, sender: user?.id, chatId };
    });
  };

  console.log(messageData);

  const sendMessageHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user?.id || !chatId) {
      return toast({
        title: "something went wrong",
        variant: "destructive",
      });
    }

    const res = await axios.post(`/api/message`, messageData);
    console.log(res);

    if (res.status === 400 || res.status === 500)
      return toast({
        title: "something went wrong, try again",
        variant: "destructive",
      });

    setMessageData({ sender: "", content: "", chatId: "" });
  };

  console.log(messageData);

  return (
    <>
      {!chatId ? (
        <p> please slecet Chat</p>
      ) : (
        <div className="h-full flex flex-col flex-1">
          <MessagePop chat={chat} user={user} />
          <div className="grid w-full gap-2 ">
            <Textarea
              value={messageData.content}
              onChange={(e) => textareaHandler(e)}
              placeholder="Type your message here."
            />
            <Button
              onClick={(e) => sendMessageHandler(e)}
              disabled={messageData.content.length === 0}
            >
              Send message
            </Button>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default ChatBox;
