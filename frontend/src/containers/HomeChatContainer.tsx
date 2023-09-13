import { useRef, useState } from 'react'
import HomeChatComponent from '../components/HomeChatComponent'
import { Message } from '../types/message'

function HomeChatContainer() {
  // Ref
  const bottomDivRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([])

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: message.trim() }])
  }

  return (
    <>
      <HomeChatComponent
        messages={messages}
        bottomDivRef={bottomDivRef}
        handleSend={handleSend}
      />
    </>
  )
}

export default HomeChatContainer
