import "./globals.css";
import { poppins_font, iran_yekan_font } from "./styles/fonts";
import Layout from '@/components/Layout';

export const metadata = { title: 'داشبورد | Admin' };

export default function RootLayout({ children }) {
  return (
     <html lang="fa" dir="rtl" className={`${poppins_font.variable} ${iran_yekan_font.variable}`}>
      <body className="h-full bg-slate-50 antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
