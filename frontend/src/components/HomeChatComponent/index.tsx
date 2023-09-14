import React from 'react'
import { Message } from '../../types/message'
import MessageInput from '../ChatComponent/MessageInput'
import MessageItem from '../ChatComponent/MessageItem'
import MessageLoading from '../ChatComponent/MessageLoading'
import TypeWriter from '../shared/TypeWriter'

interface HomeChatComponentProps {
  messages: Message[]
  /**
   * The message that is being typed by the assistant in real-time.
   */
  typedMessage: string | null
  /**
   * Callback when a message finishes typing.
   */
  onMessageTyped: (message: string) => void
  loading: boolean
  handleSend: (message: string) => void
  bottomDivRef: React.RefObject<HTMLDivElement>
  //   tokens: number
}

function HomeChatComponent({
  messages,
  typedMessage,
  onMessageTyped,
  loading,
  handleSend,
  bottomDivRef, //   tokens,
}: HomeChatComponentProps) {
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
        {typedMessage && (
          <TypeWriter
            text={typedMessage}
            delay={30}
            onFinish={onMessageTyped}
            wrapperClassName="cursor-not-allowed select-none w-fit"
            className="p-2 text-black whitespace-pre-wrap bg-gray-200 rounded-lg"
          />
        )}
        <div ref={bottomDivRef} />
      </section>

      <section className="p-4 pt-0 pb-0">
        <MessageInput
          onSend={handleSend}
          scrollTargetRef={bottomDivRef}
          disabled={loading || !!typedMessage}
        />
      </section>

      <section className="p-1 px-4 text-right">
        <span className="w-full ml-auto text-xs text-gray-500">
          Exchanged tokens: <strong className="font-bold">N/A</strong>
        </span>
      </section>
    </div>
  )
}

export default HomeChatComponent
