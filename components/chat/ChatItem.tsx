'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile } from "@prisma/client";
import * as z from 'zod'
import qs from "query-string";
import { useForm  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/use-modal-store";

import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import UserAvator from "../UserAvator";
import ActionTooltip from "../ActionTooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from '@/components/ui/form'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>
}

const roleIconMap = {
  'GUEST': null,
  'MODERATOR': <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  'ADMIN': <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />
}

const formSchema = z.object({
  content: z.string().min(1)
})

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery
}: ChatItemProps) => {
  const fileType = fileUrl?.split('.').pop()

  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const params  = useParams()
  const { onOpen } = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content
    }
  })

  // 当用户按下 esc，退出编辑
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        setIsEditing(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(JSON.stringify(values));
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      })

      await fetch(url, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })

      form.reset()
      setIsEditing(false)
    } catch (error) {
      
    }
  }

  useEffect(() => {
    form.reset({
      content: content
    })
  }, [content])

  const onMemberClick = () =>{
    if (member.id === currentMember.id) {
      return
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id

  const canDeleteMessaage = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !deleted && isOwner && !fileUrl
  const isPDF = fileType === 'pdf' && fileUrl
  const isImage = !isPDF && fileUrl

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">

        {/* AVATOR  */}
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvator src={member.profile.imageUrl} />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
               {/* USENAME  */}
              <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a 
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image 
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}

          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a 
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p className={cn(
              'text-sm text-zinc-600 dark:text-zinc-300',
              deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
            )}>
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}

          {!fileUrl && isEditing && (
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="
                  flex
                  items-center
                  w-full
                  gap-x-2
                  pt-2
                "
              >
                <FormField 
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="
                              p-2 
                              bg-zinc-200/90 
                              dark:bg-zinc-700/75 
                              border-none 
                              border-0
                              focus-visible:ring-0
                              focus-visible:ring-offset-0
                              text-zinc-600
                              dark:text-zinc-200
                            "
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size='sm' variant='primary' >
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save.
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessaage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {
            canEditMessage && (
              <ActionTooltip label="Edit">
                <Edit 
                  onClick={() => {setIsEditing(true)}}
                  className="
                    cursor-pointer 
                    ml-auto 
                    w-4 
                    h-4 
                    text-zinc-500 
                    hover:text-zinc-600 
                    dark:hover:text-zinc-300 
                    transition" 
                />
              </ActionTooltip>
            )
          }

          {
            canEditMessage && (
              <ActionTooltip label="Delete">
                <Trash onClick={() => {
                  onOpen('deleteMessge', {
                    apiUrl: `${socketUrl}/${id}`,
                    query: socketQuery
                  }) 
                  setIsEditing(false)
                }} className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
              </ActionTooltip>
            )
          }
        </div>
      )}
    </div>
  )
}

export default ChatItem
