import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="w-full border-b px-6 py-3">
      <div className="flex flex-row justify-between items-center">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Solucio AI
        </h3>

        {/*
          1. User signed in: Display avatar with dropdown menu
          2. Not signed in: Display secondary "Sign In" button
        */}

        {isSignedIn ? (
          <SignedIn>
            <DropdownMenu>
              {/* Click the avatar to open the dropdown menu */}
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>
                    {user.firstName[0] + user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <SignOutButton>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 w-4 h-4" /> Sign Out
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuContent>
            </DropdownMenu>
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
