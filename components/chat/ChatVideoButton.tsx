'use client'

import { Video, VideoOff } from "lucide-react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"
import ActionTooltip from "../ActionTooltip"

const ChatVideoButton = () => {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const patchname = usePathname()

  const isVideo = searchParams?.get('video')

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: patchname || '',
      query: {
        video: isVideo ? undefined : true
      }
    }, { skipNull: true })

    router.push(url)
  }

  const Icon = isVideo ? VideoOff : Video
  const tooltipLabel = isVideo ? 'End video call' : 'Start video call'

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  )
}

export default ChatVideoButton
