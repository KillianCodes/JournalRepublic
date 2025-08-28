import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-100 min-h-screen flex justify-center items-start">
        {children}
      </body>
    </html>
  );
}
