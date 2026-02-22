import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { he } from "@/lib/locale";
import { Heart } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / App name */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-700">
          <Heart className="w-6 h-6 fill-blue-700" />
          {he.appName}
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-700 transition-colors font-medium"
            >
              {he.dashboard}
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-gray-600 hover:text-blue-700 transition-colors font-medium"
            >
              {he.signIn}
            </Link>
            <Link
              href="/sign-up"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {he.signUp}
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
