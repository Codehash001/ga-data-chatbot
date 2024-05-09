import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./markdown.css";
import DownloadModal from "./components/downloadModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "chat with GA data",
  description: "gadata-rag-demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <DownloadModal/>
        {children}
        </body>
    </html>
  );
}
