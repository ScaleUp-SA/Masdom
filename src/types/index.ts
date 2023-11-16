import { Message } from "@prisma/client";

export type Session = {
  user: {
    name?: string; // Optional property
    email: string; // Required property
    image?: string; // Optional property
    username: string; // Required property
    isAdmin: boolean; // Required property
    id: string; // Required property
  };
};

export interface Chat {
  users: {
    id: string;
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
  };
  messages: Message[];
}
