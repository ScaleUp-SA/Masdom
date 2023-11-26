"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Session } from "@/types";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import userImg from "../../public/images/userImg.png";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = { session: Session | null };

const ChatList = ({ session }: Props) => {
  const user = session?.user;

  const router = useRouter();

  const INITIALCHATSDATA = [
    {
      createdAt: "",
      id: "",
      messages: [],
      updatedAt: "",
      users: [],
    },
  ];

  const [testChatList, setTestChatList] = useState([1, 2, 3, 4, 5]);

  const [chatsList, setChatsList] = useState(INITIALCHATSDATA);

  const [usersChat, setUsersChat] = useState<User[]>([]);

  // const [otherUser, setOtherUser] = useState<User>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/chat/getuserchat/${user?.id}`);
        console.log(res.data, "data");
        setChatsList(res.data.chats);
        console.log(res.data.chats, "chats");
      } catch (error) {
        console.error("Error", error);
      }
    })();
  }, [user]);

  console.log(chatsList, "chats");

  console.log(usersChat);

  return (
    <div className="flex flex-col items-center space-y-4" dir="rtl">
      {/* top chat list */}
      <div className=" w-full h-16 flex items-center justify-start p-5 gap-6">
        <Image
          src={userImg}
          alt="current user"
          width={50}
          className="rounded"
        />
        <span>
          <h4 className="text-md text-sky-900">current username</h4>
          <p className="text-xs text-slate-500">Currentuser@example.com</p>
        </span>
      </div>
      <hr className="w-4/5 text-slate-500" />
      <div className="flex flex-col w-full items-center gap-2 p-2">
        {chatsList.map((chat) => (
          <div key={chat.id}>
            {chat.users.map((otherUser: User) =>
              otherUser.id !== user?.id ? (
                <Link
                  key={otherUser.id}
                  href={`/profile/chat/${chat.id}`}
                  className="w-full rounded hover:bg-slate-200 active:bg-slate-50"
                >
                  <div className="h-16 flex items-center justify-start gap-6 p-2 curser-pointer">
                    <Image
                      src={userImg}
                      alt="user image"
                      width={50}
                      className="rounded"
                    />
                    <h4 key={otherUser?.id} className="text-md text-sky-900">
                      {otherUser.username}
                    </h4>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
