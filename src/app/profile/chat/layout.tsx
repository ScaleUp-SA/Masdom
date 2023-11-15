/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import Chatlist from "@/components/chatlist";

type Props = {
  children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex">
      <ScrollArea className=" min-h-screen md:w-1/4 rounded-md border p-4 mr-4">
        <Chatlist session={session} />
      </ScrollArea>{" "}
      <div className="border w-full rounded-md p-4">{children}</div>
    </div>
  );
};

export default layout;
