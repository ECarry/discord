'use client'

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,  
} from "@/components/ui/dialog"
import { useModal } from '@/hooks/use-modal-store'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useOrigin } from '@/hooks/use-origin'
import { useState } from 'react'

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal()
  const origin = useOrigin()

  const isModalOpen = isOpen && type === 'invite'
  const { server } = data

  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const onCopy = () => {
  // navigator.clipboard.writeText 是一个 Web API 方法，它允许你将文本内容写入用户的剪贴板。
  // 你可以将一个字符串传递给这个方法，然后它会尝试将这个文本复制到用户的剪贴板中，
  // 使用户可以粘贴它到其他应用程序或输入框中。
    navigator.clipboard.writeText(inviteUrl)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const onNew = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/servers/${server?.id}/invite-code`, {
        method: 'PATCH'
      })

      const data = await res.json();

      onOpen('invite', { server: data })

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
            Server invite link
          </Label>
          <div className='flex items-center mt-2 gap-x-2'>
             <Input
              readOnly
              disabled={isLoading}
              className='
                bg-zinc-300/50
                border-0
                focus-visible:ring-0
                text-black
                focus-visible:ring-offset-0
              '
              value={inviteUrl}
             />
             <Button disabled={isLoading} onClick={onCopy} size='icon'>
              {copied 
                ? <Check className='w-4 h-4' /> 
                : <Copy className='w-4 h-4' />
              }
             </Button>
          </div>
          <Button 
          onClick={onNew}
            disabled={isLoading}
            variant='link'
            size='sm'
            className='
              text-sm
              text-zinc-500
              mt-4
          '>
            Generate a new link
            <RefreshCw className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

