import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Business Platform',
  description: 'MVP business platform with agent'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ fontFamily: 'sans-serif', padding: '20px' }}>
          <h1>Business Platform MVP</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
