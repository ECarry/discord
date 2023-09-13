'use client'

import { useRouter } from 'next/navigation'

import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader, 
  DialogTitle,  
} from "@/components/ui/dialog"
import { useModal } from '@/hooks/use-modal-store'
import { Label } from '../ui/label'

export const InviteModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === 'invite'

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Frients
          </DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
            Server invite link
          </Label>
          <div>
             
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

