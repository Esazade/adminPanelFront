import "./globals.css";
import Layout from '@/components/Layout';

export const metadata = { title: 'داشبورد | Admin' };

export default function RootLayout({ children }) {
  return (
     <html lang="fa" dir="rtl" className="h-full">
      <body className="h-full bg-slate-50 antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
