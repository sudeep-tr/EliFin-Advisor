import { Geist } from "next/font/google";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
