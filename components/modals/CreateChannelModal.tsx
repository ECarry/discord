'use client'

import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import qs from 'query-string'

import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,  
} from "@/components/ui/dialog"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'


const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Channel name is required.'
  }).refine(
    name => name !== 'general',
    {
      message: "Channel name cannot be 'general'"
    }
  ),
  type: z.nativeEnum(ChannelType)
})

export const CreateChannelModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type, data } = useModal()

  const { server } = data

  const isModalOpen = isOpen && type === 'CreateChannel'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: ChannelType.TEXT
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: '/api/channels',
        query: {
          serverId: server?.id
        }
      })
      await fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error);
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Channel
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Channel name
                    </FormLabel>

                    <FormControl>
                      <Input 
                        disabled={isLoading} 
                        placeholder='Enter channel name'
                        {...field}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField 
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Channel type
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className='
                            bg-zinc-500/50
                            border-0
                            focus:ring-0
                            text-black
                            ring-offset-0
                            focus:ring-offset-0
                            capitalize
                            outline-none
                          '
                        >
                          <SelectValue placeholder='Select a channel type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem key={type} value={type} className='capitalize'>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              
              />
            </div>


            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button disabled={isLoading} variant='primary'>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

