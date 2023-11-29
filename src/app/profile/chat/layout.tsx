/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import Chatlist from "@/components/chatlist";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


type Props = {
  children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex max-sm:flex-col">
      <ScrollArea className="bg-gray-50 min-h-screen py-2 md:w-1/4 max-lg:w-2/4 max-sm:hidden">
        <Chatlist session={session} />
      </ScrollArea>

      {/* mobile size*/}
      <Accordion type="single" collapsible className="w-full p-4 hidden max-sm:block">
        <AccordionItem value="item-1" className="w-full">
          <AccordionTrigger>محادثاتك</AccordionTrigger>
          <AccordionContent className="w-fill">
            <ScrollArea className="bg-gray-50 min-h-screen w-full">
              <Chatlist session={session} />
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="border w-full max-sm:border-none">{children}</div>
    </div>
  );
};

export default layout;
