import { useEffect, useState } from "react"

// 获取当前页面的 origin（协议、主机和端口部分），但在挂载组件之前，会返回一个空字符串。

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

  if (!mounted) {
    return ''
  }

  return origin
}
