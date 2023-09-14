import React from 'react'
import { Message } from '../../types/message'
import { RadioValue } from '../../types/radio'
import MessageInput from '../ChatComponent/MessageInput'
import MessageItem from '../ChatComponent/MessageItem'
import MessageLoading from '../ChatComponent/MessageLoading'
import MessageRadio from './MessageRadio'

interface DebugChatComponentProps {
  messages: Message[]
  loading: boolean
  type: RadioValue
  setType: (value: RadioValue) => void
  handleSend: (message: string) => void
  bottomDivRef: React.RefObject<HTMLDivElement>
  tokens: number
}

function DebugChatComponent({
  messages,
  loading,
  type,
  setType,
  handleSend,
  bottomDivRef,
  tokens,
}: DebugChatComponentProps) {
  return (
    <div className="flex flex-col items-stretch h-full max-w-5xl mx-auto overflow-hidden bg-white rounded shadow-lg">
      {/* Height value is arbitrary (can be anything) but it is needed at all to play nicely with `flex-grow` */}
      <section className="flex flex-col flex-grow p-4 overflow-auto gap-y-2 h-52">
        {!messages.length && (
          <p className="my-auto text-sm text-center text-gray-500">
            No messages yet
          </p>
        )}
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
        {loading && <MessageLoading />}
        <div ref={bottomDivRef} />
      </section>

      <section className="p-4 mt-4">
        <hr className="my-2" />
        <MessageRadio value={type} onChange={setType} />
      </section>

      <section className="p-4 pt-0 pb-0">
        <MessageInput
          onSend={handleSend}
          scrollTargetRef={bottomDivRef}
          disabled={loading}
        />
      </section>

      <section className="p-1 px-4 text-right">
        <span className="w-full ml-auto text-xs text-gray-500">
          Exchanged tokens: <strong className="font-bold">{tokens}</strong>
        </span>
      </section>
    </div>
  )
}

export default DebugChatComponent
