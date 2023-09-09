import { ModeToggle } from "@/components/ModeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex justify-between items-center">
      This is a protected route.
      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserButton afterSignOutUrl="/"/>
      </div>
    </div>
  )
}
