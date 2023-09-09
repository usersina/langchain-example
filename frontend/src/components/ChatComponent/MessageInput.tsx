import { useState } from 'react'

interface MessageInputProps {
  /**
   * The ref of the element to be scrolled to the bottom.
   */
  scrollTargetRef?: React.RefObject<HTMLDivElement>
  /**
   * Whether the input is disabled.
   */
  disabled?: boolean
  /**
   * Callback function to be called when the user sends a message.
   * @param message The message to be sent.
   */
  onSend: (message: string) => void
}

function MessageInput({
  onSend,
  disabled,
  scrollTargetRef,
}: MessageInputProps) {
  const [input, setInput] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!input.trim()) return

    // Shift + Enter to add a new line, else submit
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend(input)
      setInput('')

      // Scroll to bottom
      if (scrollTargetRef?.current)
        setTimeout(() => {
          scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' })
        })
    }
  }

  return (
    <>
      <label
        htmlFor="message"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Your message or query
      </label>
      <textarea
        id="message"
        rows={4}
        className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 hover:ring-primary-500 hover:border-primary-500 focus:outline-2 transition duration-150 ease-in-out outline-primary-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
        placeholder="Enter + Shift for a new line"
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </>
  )
}

export default MessageInput
