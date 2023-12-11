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
import { Message, User } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import userImg from "../../public/images/userImg.png";
import { BsFillSendFill } from "react-icons/bs";
import { uploadcareLoader } from "@uploadcare/nextjs-loader/build/utils/loader";

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
  const [userNameChat, setUserChat] = useState<User>();
  useEffect(() => {
    (async () => {
      if (chatId) {
        try {
          const res = await axios.get(`/api/chat/getchat/${chatId}`);
          const users = res.data.chat.users;
          setChat(res.data.chat);
          setUserChat(() =>
            users.find((chatUser: User) => chatUser.id !== user?.id)
          );
          setChatMessage(res.data.chat.messages);
        } catch (error) {
          console.error("Error", error);
        }
      }
    })();
  }, [chatId]);

  useEffect(() => {
    const messageHandler = (messages: Message) => {
      setChatMessage((prev) => [
        ...prev,
        (chatMessage[chatMessage.length - 1] = messages),
      ]);
    };

    if (chatId) {
      pusherClient.subscribe(chatId!);
      pusherClient.bind("message", messageHandler);
    } else {
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
        <p className="p-5 min-h-screen">من فضلك حدد المحادثة</p>
      ) : (
        <div className="flex flex-col">
          {/* top chat box */}
          <div className="w-full flex items-center p-5 gap-5 border-b">
            <Image
              src={userImg}
              alt="user image"
              width={50}
              className="rounded"
              loader={uploadcareLoader}
            />
            <h4 className="text-md text-sky-900">{userNameChat?.username}</h4>
          </div>
          <ScrollArea className="h-[650px]">
            <MessagePop chat={chat} user={user} chatMessage={chatMessage} />
          </ScrollArea>
          <div className="flex items-center w-full p-5 border-t gap-5">
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
