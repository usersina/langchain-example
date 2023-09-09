import { useMemo } from 'react'
import { Message } from '../../types/message'

interface MessageItemProps {
  message: Message
}

function MessageItem({ message }: MessageItemProps) {
  const classes = useMemo(() => {
    switch (message.owner) {
      case 'ai':
        return 'bg-gray-200 text-black'
      case 'human':
        return 'bg-primary-500 text-white'
      case 'error':
        return 'bg-red-400 text-white'
    }
  }, [message.owner])

  return (
    <div className={`w-fit ${message.owner === 'human' ? 'self-end' : ''}`}>
      <p className={`p-2 rounded-lg whitespace-pre-wrap ${classes}`}>
        {message.text}
      </p>
    </div>
  )
}

export default MessageItem
