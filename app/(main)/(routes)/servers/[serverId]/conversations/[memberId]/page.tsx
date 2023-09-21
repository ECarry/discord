import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

interface ConversationIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  }
}

const ConversationIdPage = async ({
  params
}: ConversationIdPageProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  })

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  // 比较哪个是对方
  const otherMember = memberOne.profile.id === profile.id ? memberTwo : memberOne

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        type="conversation"
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
      />

      <ChatMessages
        member={currentMember}
        name={otherMember.profile.name}
        chatId={conversation.id}
        type="conversation"
        apiUrl='/api/direct-messages'
        paramKey="conversationId"
        paramValue={conversation.id}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation.id 
        }}
      />

      <ChatInput 
        name={otherMember.profile.name}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversation.id 
        }}
      />
    </div>
  )
}

export default ConversationIdPage
