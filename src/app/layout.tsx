import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
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
  return (
    <html lang="en">
      <body className={alexandria.className}>
        <AuthContextProvider>
          <Header />
          {children}
          <Toaster />
          <Footer />
        </AuthContextProvider>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `  window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-QC5G6QZ864');
          `,
          }}
        />
      </body>
    </html>
  );
}
