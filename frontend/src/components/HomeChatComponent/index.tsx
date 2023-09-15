import React from 'react'
import { Message } from '../../types/message'
import MessageInput from '../ChatComponent/MessageInput'
import MessageItem from '../ChatComponent/MessageItem'
import MessageLoading from '../ChatComponent/MessageLoading'
import AsyncTypeWriter from '../shared/AsyncTypeWriter'

interface HomeChatComponentProps {
  messages: Message[]
  stream: AsyncIterable<string> | null
  handleTypingEnd: (message: string) => void
  loading: boolean
  handleSend: (message: string) => void
  bottomDivRef: React.RefObject<HTMLDivElement>
  //   tokens: number
}

function HomeChatComponent({
  messages,
  stream,
  handleTypingEnd,
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
        {stream && (
          <AsyncTypeWriter
            stream={stream}
            delay={30}
            onTypingEnd={handleTypingEnd}
            Wrapper={({ text }) => (
              <>
                <div className="cursor-not-allowed select-none w-fit">
                  <p className="p-2 text-black whitespace-pre-wrap bg-gray-200 rounded-lg">
                    {text}
                  </p>
                </div>
              </>
            )}
          />
        )}
        <div ref={bottomDivRef} />
      </section>

      <section className="p-4 pt-0 pb-0">
        <MessageInput
          onSend={handleSend}
          scrollTargetRef={bottomDivRef}
          disabled={loading || !!stream}
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
