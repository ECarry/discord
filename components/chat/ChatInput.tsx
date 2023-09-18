'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "../EmojiPicker";
import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: 'conversation' | 'channel'
}

const formScheam = z.object({
  content: z.string().min(1)
})

const ChatInput = ({
  apiUrl,
  query,
  name,
  type
}: ChatInputProps) => {
  const { onOpen } = useModal()
  const router = useRouter()

  const form = useForm<z.infer<typeof formScheam>>({
    resolver: zodResolver(formScheam),
    defaultValues: {
      content: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formScheam>) => {
    try {
      console.log(values);
      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      })
      
      await fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      form.reset()
      router.refresh()
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {onOpen('messageFile', { apiUrl, query })}}
                    className="
                      absolute 
                      top-7 
                      left-8 
                      h-[24px] 
                      w-[24px]
                      bg-zinc-500
                      dark:bg-zinc-400
                      hover:bg-zinc-600
                      dark:hover:bg-zinc-300
                      transition
                      rounded-full
                      p-1
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    placeholder={`Message ${type === 'conversation' ? name : '#' + name}`}
                    className="
                      px-14
                      py-6
                      bg-zinc-200/90
                      dark:bg-zinc-700/75
                      border-none
                      border-0
                      focus-visible:ring-0
                      focus-visible:ring-offset-0
                      text-zinc-600
                      dark:text-zinc-200
                    "
                    {...field}
                  />

                  <div className="absolute top-7 right-8">
                    <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)} />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput
