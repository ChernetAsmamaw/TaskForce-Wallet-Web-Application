"use client";

import React, { useState } from "react";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { ThemeSwitcherButton } from "./ThemeSwitcherButton";
import { UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItemsList = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

export default function NavBar() {
  return (
    <>
      <DesktopNavBar />
      <MobileNavBar />
    </>
  );
}

/******************* DesktopNavBar *******************/

function DesktopNavBar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block w-full">
      <nav className="container flex justify-between items-center px-8">
        <div className="flex min-h-[60px] items-center gap-x-6 px-2">
          <Logo />
          <div className="flex h-full">
            {navItemsList.map((item) => (
              <NavbarItem
                key={item.label}
                label={item.label}
                link={item.link}
              />
            ))}
          </div>
        </div>
        <div className="flex items-end ml-0 sm:ml-8 gap-8">
          <div className="scale-120">
            <ThemeSwitcherButton />
          </div>
          <div className="scale-125">
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({ label, link }: { label: string; link: string }) {
  const pathName = usePathname();
  const isActive = pathName === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost", size: "default" }),
          "w-full justify-center text-base text-muted-foreground hover:text-foreground px-6",
          isActive && "text-foreground"
        )}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden w-[80%] h-[2px] -translate-x-12 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
}

/******************* MobileNavBar *******************/

function MobileNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();

  return (
    <div className="md:hidden border-b bg-background">
      <div className="flex items-center justify-between px-4 py-2">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="scale-125">
            <ThemeSwitcherButton />
          </div>
          <div className="scale-125">
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2.5 hover:bg-accent rounded-md">
                {isOpen ? (
                  <X className="h-7 w-7" />
                ) : (
                  <Menu className="h-7 w-7" />
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-12">
              <nav className="flex flex-col gap-4">
                {navItemsList.map((item) => (
                  <MobileNavItem
                    key={item.label}
                    {...item}
                    isActive={pathName === item.link}
                    onItemClick={() => setIsOpen(false)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({
  label,
  link,
  isActive,
  onItemClick,
}: {
  label: string;
  link: string;
  isActive: boolean;
  onItemClick: () => void;
}) {
  return (
    <Link
      href={link}
      onClick={onItemClick}
      className={cn(
        "flex items-center px-4 py-3 text-base rounded-md transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      {label}
    </Link>
  );
}
