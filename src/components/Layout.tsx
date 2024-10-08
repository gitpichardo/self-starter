'use client'

import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title = 'Self Starter' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={`${poppins.className} min-h-screen bg-gray-100 flex flex-col`}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 text-center text-gray-600">
            © 2024 Self Starter. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
