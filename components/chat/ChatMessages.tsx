import { Member } from "@prisma/client";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: {
    channelId: string,
    serverId: string
  };
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation'
}

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type
}: ChatMessagesProps) => {
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      
    </div>
  )
}

export default ChatMessages
