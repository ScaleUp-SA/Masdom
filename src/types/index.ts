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
