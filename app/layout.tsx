"use client"; // Add this line to ensure client-side behavior

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { store } from "@/store/store";
import { Provider } from 'react-redux';
import { Suspense } from "react";
import { Loading } from "@/components/loading";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <ClerkProvider>
            <Provider store={store}>
              {children}
            </Provider>
          </ClerkProvider>
        </Suspense>
      </body>
    </html >
  );
}
