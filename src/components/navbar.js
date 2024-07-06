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

  // Helper function to get initials
  const getUserInitials = () => {
    let initials = "";
    if (user.firstName) {
      initials += user.firstName[0];
    }
    if (user.lastName) {
      initials += user.lastName[0];
    }
    return initials;
  };

  return (
    <div className="w-full border-b px-6 py-3">
      <div className="flex flex-row justify-between items-center">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Solucio AI
        </h3>

        {isSignedIn ? (
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  {user.imageUrl ? (
                    <AvatarImage src={user.imageUrl} />
                  ) : (
                    <AvatarFallback>
                      {getUserInitials()}
                    </AvatarFallback>
                  )}
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
