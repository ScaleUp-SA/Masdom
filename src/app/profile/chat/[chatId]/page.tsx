import React from "react";

type Props = {
  params: { chatId: string };
};

const Page = ({ params }: Props) => {
  const { chatId } = params;
  const [userId1, userId2] = chatId.split("-");

  

  return <div>{chatId}</div>;
};

export default Page;
