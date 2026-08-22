import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "EliFin",
  description: "Track expenses, portfolio, goals, and get an AI coach.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
