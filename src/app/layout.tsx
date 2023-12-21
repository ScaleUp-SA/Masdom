import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import AuthContextProvider from "./../lib/AuthContext";

const alexandria = Alexandria({ subsets: ["latin", "arabic"] });

export const metadata: Metadata = {
  title: {
    default: "منصة مصدوم",
    template: "%s | منصة مصدوم",
  },
  description: "أول منصة عربية لبيع و شراء و مراهنات السيارات المصدومة",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);


  return (
    <html lang="en">
      <body className={alexandria.className}>
        <AuthContextProvider>
          <Header session={session} />
          {children}
          <Toaster />
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}
