import { useRef, useState } from 'react'
import { chatStream } from '../api/v1'
import HomeChatComponent from '../components/HomeChatComponent'
import { Message } from '../types/message'

function HomeChatContainer() {
  const bottomDivRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  // ======================= Handlers ======================= //
  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: message.trim() }])
    setLoading(true)
    try {
      const stream = await chatStream(message, messages)
      setLoading(false)

      const newMessage: Message = { role: 'assistant', content: '' }

      // We have the stream, get the chunks until it ends
      setMessages((prev) => [...prev, newMessage])
      for await (const chunk of stream) {
        newMessage.content += chunk
        setMessages((prev) => [...prev])
        if (bottomDivRef.current) {
          setTimeout(() => {
            bottomDivRef.current?.scrollIntoView({ behavior: 'smooth' })
          })
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          content: `Something went wrong: ${(error as Error).message}`,
        },
      ])
      setLoading(false)
    }
  }

  // ======================= Render ======================= //
  return (
    <HomeChatComponent
      messages={messages}
      loading={loading}
      bottomDivRef={bottomDivRef}
      handleSend={handleSend}
    />
  )
}

export default HomeChatContainer
