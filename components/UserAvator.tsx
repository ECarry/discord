import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar"
import { cn } from "@/lib/utils";

interface UserAvatorProps {
  src?: string;
  className?: string;
}

const UserAvator = ({
  src,
  className,
}: UserAvatorProps) => {
  return (
    <Avatar className={cn('w-7 h-7', className)}>
      <AvatarImage src={src} alt="@shadcn" />
    </Avatar>
  )
}

export default UserAvator
