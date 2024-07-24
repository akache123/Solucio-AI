import Link from "next/link";

import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";

import { Button } from "../components/ui/button";

export default function LandingPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="w-full bg-background flex h-screen items-center justify-center">
      <div className="grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
            Get Recommendations for Food
          </h1>
          <p className="max-w-[600px] text-muted-foreground font-light tracking-wide md:text-xl lg:text-base xl:text-xl">
            Tired? Hungry? Find the dinner you want... instantly.
          </p>
          {isSignedIn ? (
            <Link href="/dashboard">
              <Button className="mt-4">Go to Dashboard</Button>
            </Link>
          ) : (
            <Button className="mt-4" variant={"secondary"} size="lg">
              <SignInButton />
            </Button>
          )}
        </div>
        <div className="bg-muted rounded-xl aspect-[4/3] w-full" />
      </div>
    </div>
  );
}
