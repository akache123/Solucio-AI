import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="w-full border-b px-6 py-3">
      <div className="flex flex-row justify-between items-center">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Solucio AI
        </h3>

        {isSignedIn ? (
          <SignedIn>
            <Avatar>
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>
                {user.firstName[0] + user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </SignedIn>
        ) : (
          <SignedOut>
            <Button variant={"secondary"}>
              <SignInButton />
            </Button>
          </SignedOut>
        )}
      </div>
    </div>
  );
}
