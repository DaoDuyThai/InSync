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
      <head>
        <title>InSync</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="InSync" />
        <meta name="author" content="InSync Team" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      </head>
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
