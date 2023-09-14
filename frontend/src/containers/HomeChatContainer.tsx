import { useRef, useState } from 'react'
import { chatStream } from '../api/v1'
import HomeChatComponent from '../components/HomeChatComponent'
import { Message } from '../types/message'

function HomeChatContainer() {
  const bottomDivRef = useRef<HTMLDivElement>(null)

  // ======================= State ======================= //
  const [messages, setMessages] = useState<Message[]>([])
  const [typedMessage, setTypedMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // ======================= Handlers ======================= //
  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: message.trim() }])
    setLoading(true)
    try {
      const stream = await chatStream(message, messages)
      setLoading(false) // stream is ready to be processed, stop loading

      // For each chunk of data, set it to the typed state that will type it
      for await (const chunk of stream) {
        setTypedMessage((prev) => (prev ? prev + chunk : chunk) ?? null)
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

  /**
   * This function is called when a message finishes typing.
   * @param message The typed message.
   */
  const handleMessageTyped = (message: string) => {
    setMessages((prev) => [...prev, { role: 'assistant', content: message }])
    setTypedMessage(null)
  }

  // ======================= Render ======================= //
  return (
    <HomeChatComponent
      messages={messages}
      typedMessage={typedMessage}
      onMessageTyped={handleMessageTyped}
      loading={loading}
      bottomDivRef={bottomDivRef}
      handleSend={handleSend}
    />
  )
}

export default HomeChatContainer
