"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Session } from "@/types";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  //   const [otherUser, setOtherUser] = useState<User>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `/api/chat/getuserchat/${user?.id}`
        );
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
    <div className="space-y-4">
      {chatsList.map((chat) => (
        <div key={chat.id}>
          {chat.users.map((otherUser: User) =>
            otherUser.id !== user?.id ? (
              <Link
                key={otherUser.id}
                href={`/profile/chat/${chat.id}`}
                className="flex border w-full h-16 rounded items-center cursor-pointer"
              >
                <div className="mr-4 flex-shrink-0 ">
                  <svg
                    className="h-10 w-10 border border-gray-300 bg-white text-gray-300"
                    preserveAspectRatio="none"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 200 200"
                    aria-hidden="true"
                  >
                    <path
                      vectorEffect="non-scaling-stroke"
                      strokeWidth={1}
                      d="M0 0l200 200M0 200L200 0"
                    />
                  </svg>
                </div>
                <div>
                  <div>
                    <h4 key={otherUser?.id} className="text-lg font-bold">
                      {otherUser.username}
                    </h4>
                  </div>
                </div>
              </Link>
            ) : null
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
