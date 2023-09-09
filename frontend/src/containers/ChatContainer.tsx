import { useRef, useState } from 'react'
import ChatComponent from '../components/ChatComponent'
import { Message } from '../types/message'
import { RadioValue } from '../types/radio'

function ChatContainer() {
  // Ref
  const bottomDivRef = useRef<HTMLDivElement>(null)

  // State
  const [type, setType] = useState<RadioValue>('generate')
  const [loading, setLoading] = useState(false)
  const [tokens, setTokens] = useState(0)
  const [messages, setMessages] = useState<Message[]>([
    { owner: 'human', text: 'Hello there' },
    { owner: 'ai', text: 'Hello there, how can I help you?' },
    {
      owner: 'error',
      text: 'Something went wrong: Error: Request failed with status code 500',
    },
  ])

  // Handlers
  const handleSend = (message: string) => {
    setLoading(true)
    try {
      setMessages((messages) => [
        ...messages,
        { owner: 'human', text: message },
      ])
      setTokens((tokens) => tokens + 1)
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          owner: 'error',
          text: `Something went wrong: ${(error as Error).message}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Render
  return (
    <ChatComponent
      messages={messages}
      loading={loading}
      type={type}
      setType={setType}
      handleSend={handleSend}
      bottomDivRef={bottomDivRef}
      tokens={tokens}
    />
  )
}

export default ChatContainer
