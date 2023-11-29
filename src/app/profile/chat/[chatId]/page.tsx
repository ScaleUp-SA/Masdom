import ChatBox from "@/components/chatbox";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";

type Props = {
  params: { chatId: string };
};

const Page = async ({ params }: Props) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);

  return (
    <>
      <ChatBox chatId={chatId} session={session} />
    </>
  );
};

export default Page;
