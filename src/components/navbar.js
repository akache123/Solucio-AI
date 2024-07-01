import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import { Button } from "./ui/button";

export function Navbar() {
  return (
    <div className="w-full border-b px-6 py-3">
      <div className="flex flex-row justify-between items-center">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Solucio
        </h3>
        <SignedOut>
          <Button variant={"secondary"}>
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
      </div>
    </div>
  );
}
