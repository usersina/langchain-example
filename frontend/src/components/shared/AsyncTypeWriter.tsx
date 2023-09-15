import React, { useCallback, useEffect, useRef, useState } from 'react'

interface WrapperProps {
  /**
   * The text that's being typed.
   */
  text: string
}

interface AsyncTypeWriterProps {
  /**
   * The stream to read and type from.
   */
  stream: AsyncIterable<string>
  /**
   * The delay between typing each character in milliseconds. Default is `20`.
   */
  delay?: number
  /**
   * The time to wait before calling the `onEnd` callback in milliseconds. Default is `1000`.
   * Increasing this value guarantees that slow streams will have enough time to finish typing.
   */
  abortDelay?: number
  /**
   * Callback for when the message finishes typing. Note that the stream can be closed before the message finishes typing.
   */
  onTypingEnd?: (message: string) => void
  /**
   * Callback for when the stream ends.
   */
  onStreamEnd?: (message: string) => void
  /**
   * Whether or not to continuously scroll to the bottom of the container as soon as text is typed. Default is `true`.
   */
  continuousScroll?: boolean
  /**
   * The wrapper element to wrap the typed text in. Default is `span`.
   */
  Wrapper?: React.ElementType<WrapperProps>
}

/**
 * A component that types text from an async iterable stream character by character.
 *
 * It also handles slow streams by waiting for a bit before calling the optional `onEnd` callback.
 *
 * @example
 * ```tsx
 * <AsyncTypeWriter
 *   stream={stream}
 *   Wrapper={({ text }) => <p>{text}</p>}
 * />
 * ```
 */
function AsyncTypeWriter({
  stream,
  delay = 20,
  abortDelay = 1000,
  onTypingEnd,
  onStreamEnd,
  continuousScroll = true,
  Wrapper,
}: AsyncTypeWriterProps) {
  const scrollTargetRef = useRef<HTMLDivElement>(null)
  /**
   * This is a ref to ensure no endless loop is caused by the `useCallback` hook.
   */
  const onTypingEndRef = useRef(onTypingEnd)
  /**
   * This is a ref to ensure no endless loop is caused by the `useEffect` hook.
   */
  const onStreamEndRef = useRef(onStreamEnd)

  /**
   * This is a ref to the timer that is used to determine if the stream is finished.
   */
  const abortTimerRef = useRef<number | null>(null)

  // The state representing the text that's being received from the stream
  const [text, setText] = useState('')
  // The text that's currently being typed, this is what's rendered
  const [currentText, setCurrentText] = useState('')
  // The index of the current character being typed
  const [currentIndex, setCurrentIndex] = useState(0)

  /**
   * Populates the text ref with the text from the stream by iterating over it.
   * Does not cause a re-render.
   */
  const populateTextRef = useCallback(async () => {
    console.debug('Reading the stream...')
    let total = ''
    for await (const chunk of stream) {
      total += chunk
      setText((prev) => prev + chunk)
    }
    console.debug('Finished reading the stream. Calling onStreamEnd if any.')
    onStreamEndRef.current && onStreamEndRef.current(total)
  }, [stream])

  /**
   * The effect response for calling the populate function.
   * Should only be called once.
   */
  useEffect(() => {
    populateTextRef()
  }, [populateTextRef])

  /**
   * Actually handles the typing. Note that this does not start typing until the `startTyping` state is set to true.
   * Additionally, this continuously calls itself until the text is finished typing.
   */
  useEffect(() => {
    console.debug('Text or index updated. Typing the next character...')
    let timeout: ReturnType<typeof setTimeout>
    let abort = abortTimerRef.current

    // If the current index is less than the text length, type the next character after a delay.
    if (currentIndex < text.length) {
      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex])
        setCurrentIndex((prevIndex) => prevIndex + 1)

        if (continuousScroll) {
          // TODO: Don't scroll if the user is scrolling manually
          scrollTargetRef.current?.scrollIntoView({ behavior: 'instant' })
        }
      }, delay)
      return
    }

    // If the current index is equal to the text length then, either:
    // 1. We are done typing.
    // 2. Or the stream reached the end.
    //
    // We wait for one second for the stream to receive any additional data.
    // If no additional data is received, then we are done typing.
    console.debug(
      'Cursor reached the text length. If no additional text is received within a second, we are done typing.'
    )
    abort = setTimeout(() => {
      console.debug('Finished typing. Calling onTypingEndRef if any.')
      onTypingEndRef.current && onTypingEndRef.current(text)
    }, abortDelay)

    return () => {
      // Clear the timeout just in case we have one from the previous render.
      clearTimeout(timeout)
      // This guarantees that the abort timer is cleared as soon as the text or index is updated.
      if (abort) clearTimeout(abort)
    }

    // relevant dependencies are the text and the index
  }, [text, currentIndex, delay, abortDelay, continuousScroll])

  return (
    <>
      {Wrapper ? <Wrapper text={currentText} /> : <span>{currentText}</span>}{' '}
      <div ref={scrollTargetRef} />
    </>
  )
}

export default AsyncTypeWriter
