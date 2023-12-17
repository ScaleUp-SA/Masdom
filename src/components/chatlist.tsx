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

  const [chatsList, setChatsList] = useState(INITIALCHATSDATA);

  const [usersChat, setUsersChat] = useState<User[]>([]);

  // const [otherUser, setOtherUser] = useState<User>({});

  useEffect(() => {
    (async () => {
      if (user) {
        try {
          const res = await axios.get(`/api/chat/getuserchat/${user?.id}`);
          console.log(res);

          setChatsList(res.data.chats);
        } catch (error) {
          console.error("Error", error);
        }
      }
    })();
  }, [user]);

  return (
    <div className="flex flex-col w-full items-center space-y-4" dir="rtl">
      {/* top chat list */}
      {/* <div className=" w-full h-16 flex items-center justify-start p-5 gap-6">
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
      <hr className="w-4/5 text-slate-500" /> */}
      <div className="flex flex-col w-full items-start gap-2 p-2">
        {chatsList.map((chat) => (
          <div key={chat.id} className="w-full">
            {chat.users.map((otherUser: User) =>
              otherUser.id !== user?.id ? (
                <Link key={otherUser.id} href={`/profile/chat/${chat.id}`}>
                  <div className="h-16 w-full flex items-center justify-start gap-6 p-4 curser-pointer rounded hover:bg-slate-200">
                    <Image
                      src={userImg}
                      alt="user image"
                      width={50}
                      className="rounded"
                    />
                    <h4 key={otherUser?.id} className="text-md text-sky-900 ">
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
