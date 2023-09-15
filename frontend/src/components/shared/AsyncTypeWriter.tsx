import { useCallback, useEffect, useRef, useState } from 'react'

interface AsyncTypeWriterProps {
  stream: AsyncIterable<string>
  /**
   * Callback when the stream ends.
   */
  onEnd?: (message: string) => void
}

/**
 * A type writer that takes an async iterable and types it each time a new chunk is received.
 */
function AsyncTypeWriter({ stream, onEnd }: AsyncTypeWriterProps) {
  /**
   * This is a ref to ensure no endless loop is caused by the `useCallback` hook.
   */
  const onEndRef = useRef(onEnd)

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
    for await (const chunk of stream) {
      setText((prev) => prev + chunk)
    }
    console.debug('Finished reading the stream.')
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
      }, 30)
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
      console.debug('Finished typing, calling onEnd if any.')
      onEndRef.current && onEndRef.current(text)
    }, 1000)

    return () => {
      // Clear the timeout just in case we have one from the previous render.
      clearTimeout(timeout)
      // This guarantees that the abort timer is cleared as soon as the text or index is updated.
      if (abort) clearTimeout(abort)
    }
  }, [text, currentIndex])

  return (
    <div>
      <h1>AsyncTypeWriter</h1>
      <p>{currentText}</p>
    </div>
  )
}

export default AsyncTypeWriter
