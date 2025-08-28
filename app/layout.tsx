import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head />
      <body className="h-full min-h-screen bg-gray-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
