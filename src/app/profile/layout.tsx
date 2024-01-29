import { Metadata } from "next";
import ProfileLayout from "@/components/profileLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import AdminLayout from "@/components/adminLayout";

export const metadata: Metadata = {
  title: "إضــافة سيـارة",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <>
      {session?.user.isAdmin ? (
        <AdminLayout>{children}</AdminLayout>
      ) : (
        <ProfileLayout>{children}</ProfileLayout>
      )}
    </>
  );
}
