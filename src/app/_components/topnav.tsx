import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="bg-background border-border flex h-16 items-center justify-between border-b px-4">
      <div>🌱 GROWcery 🌱</div>

      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <div className="[&>*]:cursor-pointer">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
