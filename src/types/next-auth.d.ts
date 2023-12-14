import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface AdaptedUser {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    phoneNumber: string;
  }

  export interface User {
    name?: string; // Optional property
    email: string; // Required property
    image?: string; // Optional property
    username: string; // Required property
    isAdmin: boolean; // Required property
    id: string; // Required property
    phoneNumber: string; // Added property
  }

  export interface Session {
    user: User;
    token: {
      name?: string; // Optional property
      email: string; // Required property
      image?: string; // Optional property
      username: string; // Required property
      isAdmin: boolean; // Required property
      id: string; // Required property
      phoneNumber: string; // Added property
    };
  }
}

declare interface AuthOptions {
  adapter: PrismaAdapter<AdaptedUser> | undefined;
}
