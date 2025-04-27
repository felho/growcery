import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu as MenuIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

interface TopNavProps {
  toggleSidebar: () => void;
  hasSidebar?: boolean;
}

export function TopNav({ toggleSidebar, hasSidebar = false }: TopNavProps) {
  return (
    <header className="bg-background border-border flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center">
        {hasSidebar ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-11 shrink-0" />
        )}
        <h1 className="text-xl font-semibold text-[hsl(122,50%,45%)]">
          GROWcery
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <SignedOut>
          <div className="[&>*]:cursor-pointer">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
