"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "./themeToggle";
import { AddHabit } from "../addHabit";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-10 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            Habit tracker
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <AddHabit />
          <ModeToggle />
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button size="sm" onClick={() => router.push("/auth")}>
            {session ? session.user.displayUsername : "Log In"}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-87.5">
            <div className="flex flex-col gap-6 pt-6 mx-10">
              <AddHabit />
              <ModeToggle />
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  className="w-full justify-start"
                  onClick={() => router.push("/auth")}
                >
                  {session ? session.user.displayUsername : "Log In"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
