"use client";

import { Chat, Session } from "@/types";
import axios from "axios";
import React, { ReactEventHandler, useEffect, useState } from "react";
import MessagePop from "./messagepop";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "./ui/use-toast";
import { pusherClient } from "@/lib/pusher";
import { Message } from "@prisma/client";
import { find } from "lodash";
import Image from "next/image";
import userImg from "../../public/images/userImg.png";
import { BsFillSendFill } from "react-icons/bs";

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
  const [chatMessage, setChatMessage] = useState<Message[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/chat/getchat/${chatId}`);
        setChat(res.data.chat);
        setChatMessage(res.data.chat.messages);
      } catch (error) {
        console.error("Error", error);
      }
    })();
  }, [chatId]);

  useEffect(() => {
    const messageHandler = (messages: Message) => {
      console.log(messages, "rrrrrrrrrrrrrrrrrr");
      setChatMessage((prev) => [
        ...prev,
        (chatMessage[chatMessage.length - 1] = messages),
      ]);
    };

    if (chatId) {
      pusherClient.subscribe(chatId!);
      pusherClient.bind("message", messageHandler);
    } else {
      console.log("chatId not found");
    }
    return () => {
      pusherClient.unsubscribe(chatId!);
      pusherClient.unbind("message", messageHandler);
    };
  }, [chatId]);

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

  return (
    <>
      {!chatId ? (
        <p className="p-5">من فضلك حدد المحادثة</p>
      ) : (
        <div className="h-full flex flex-col flex-1">
          {/* top chat box */}
          <div className="w-full h-20 flex items-center p-5 gap-5 border-b">
            <Image
              src={userImg}
              alt="user image"
              width={50}
              className="rounded"
            />
            <h4 className="text-md text-sky-900">username</h4>
          </div>
          <MessagePop chat={chat} user={user} chatMessage={chatMessage} />
          <div className="flex items-center w-full h-20 p-5 border-t gap-5">
            <Textarea
              value={messageData.content}
              onChange={(e) => textareaHandler(e)}
              placeholder="اكتب رسالتك هنا."
              className=" resize-none max-h-10 min-h-6 rounded-full outline-8"
            />
            <Button
              onClick={(e) => sendMessageHandler(e)}
              disabled={messageData.content.length === 0}
              className="bg-green-400 text-xl hover:bg-green-600 rounded-full"
            >
              <BsFillSendFill />
            </Button>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default ChatBox;
