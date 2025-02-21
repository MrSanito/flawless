import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "To-Do App",
  description: "Manage your tasks easily.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* ✅ Navbar (Fixed at Top) */}
          <header className="bg-indigo-600 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full shadow-md">
            <h1 className="text-lg font-bold">To-Do App</h1>
            <div>
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          {/* Push Content Down to Avoid Overlap */}
          <main className="mt-20">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
