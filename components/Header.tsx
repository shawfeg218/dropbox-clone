import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      {/* left */}
      <Link href="/" className="flex items-center space-x-2">
        <div className="bg-[#0160FE] w-fit p-2">
          <Image alt="logo" src="/img/dropbox_icon.png" className="invert" width={40} height={40} />
        </div>
        <h1 className="font-bold text-xl">Dropbox</h1>
      </Link>

      {/* right */}
      <div className="flex p-4">
        {/* Theme toggler */}

        <UserButton afterSignOutUrl="/" />

        <SignedOut>
          <SignInButton afterSignInUrl="/dashboard" mode="modal">
            sign in
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}
