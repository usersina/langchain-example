import { useRef, useState } from 'react'
import ChatComponent from '../components/ChatComponent'
import { chat, generate, sqlQueryAgent } from '../services/api'
import { Message } from '../types/message'
import { RadioValue } from '../types/radio'

function ChatContainer() {
  // Ref
  const bottomDivRef = useRef<HTMLDivElement>(null)

  // State
  const [type, setType] = useState<RadioValue>('chatbot')
  const [loading, setLoading] = useState(false)
  const [tokens, setTokens] = useState(0)
  const [messages, setMessages] = useState<Message[]>([
    // { owner: 'human', text: 'Hello there' },
    // { owner: 'ai', text: 'Hello there, how can I help you?' },
    // {
    //   owner: 'error',
    //   text: 'Something went wrong: Error: Request failed with status code 500',
    // },
  ])

  // Handlers
  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: message.trim() }])
    setLoading(true)
    try {
      switch (type) {
        case 'chatbot': {
          const [result, tokens] = await chat(message, messages)
          setTokens((prev) => prev + tokens)
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: result },
          ])
          break
        }
        case 'generate': {
          const [result, tokens] = await generate(message)
          setTokens((prev) => prev + tokens)
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: result },
          ])
          break
        }
        case 'sql': {
          const [result, tokens] = await sqlQueryAgent(message)
          setTokens((prev) => prev + tokens)
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: result },
          ])
          break
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
