import React from "react";

type Props = {
  params: { chatId: string };
};

const Page = ({ params }: Props) => {
  const { chatId } = params;
  const [userId1, userId2] = chatId.split("--");

  console.log(userId1, 1);
  console.log(userId2, 2);

  return <div>{chatId}</div>;
};

export default Page;
