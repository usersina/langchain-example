import { useMemo } from 'react'
import { Message } from '../../types/message'

interface MessageItemProps {
  message: Message
}

function MessageItem({ message }: MessageItemProps) {
  const classes = useMemo(() => {
    switch (message.role) {
      case 'assistant':
        return 'bg-gray-200 text-black'
      case 'user':
        return 'bg-primary-500 text-white'
      case 'error':
        return 'bg-red-400 text-white'
    }
  }, [message.role])

  return (
    <div className={`w-fit ${message.role === 'user' ? 'self-end' : ''}`}>
      <p className={`p-2 rounded-lg whitespace-pre-wrap ${classes}`}>
        {message.content}
      </p>
    </div>
  )
}

export default MessageItem
