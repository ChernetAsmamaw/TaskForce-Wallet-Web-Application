import type { Metadata } from "next";
import "./globals.css";
import { Poppins, Montserrat } from "next/font/google";
import {
  ClerkProvider,
  // SignInButton,
  // SignedIn,
  // SignedOut,
  // UserButton,
} from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "sonner";
import { DataProvider } from "@/components/providers/DataProvider";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wallet App",
  description: "TaskForce Wallet Web Application Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="light"
        style={{ scrollBehavior: "smooth", colorScheme: "dark" }}
        suppressHydrationWarning
      >
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>

        <body
          className={`${poppins.className} ${montserrat.className} antialiased`}
        >
          <RootProviders>{children}</RootProviders>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
