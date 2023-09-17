import { Hash } from "lucide-react";
import MobileToggle from "@/components/MobileToggle";
import UserAvator from "@/components/UserAvator";
import SocketIndicator from "@/components/SocketIndicator";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}

const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl
}: ChatHeaderProps) => {
  return (
    <div 
      className="
        font-semibold 
        px-3 
        flex 
        items-center 
        h-12 
        border-neutral-200
        dark:border-neutral-800
        border-b-2
      "
      >
      <MobileToggle serverId={serverId} />

      {type === 'channel' && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === 'conversation' && (
        <UserAvator 
          src={imageUrl}
          className="h-8 w-8 md:h-8 md:w-8 mr-2"
        />
      )}
      <p className="font-semibold text-black dark:text-white">{name}</p>

      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  )
}

export default ChatHeader
