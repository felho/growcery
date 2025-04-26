import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
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
