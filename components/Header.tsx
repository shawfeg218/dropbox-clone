import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      {/* left */}
      <Link href="/" className="flex items-center space-x-2">
        <div className="bg-[#0160FE] w-fit p-2">
          <Image alt="logo" src="/img/dropbox_icon.png" className="invert" width={40} height={40} />
        </div>
        <h1 className="font-bold text-2xl">Dropbox</h1>
      </Link>

      {/* right */}
      <div className="flex p-2 space-x-4 items-center">
        <ThemeToggler />
        <UserButton afterSignOutUrl="/" />

        <SignedOut>
          <SignInButton afterSignInUrl="/dashboard" mode="modal">
            Sign in
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}
