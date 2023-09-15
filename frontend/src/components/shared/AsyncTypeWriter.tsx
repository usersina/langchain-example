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
   * Used to store the text that is being generated. This does not cause a re-render.
   */
  const textRef = useRef('')
  /**
   * This is a ref to ensure no endless loop is caused by the `useCallback` hook.
   */
  const onEndRef = useRef(onEnd)

  // The state responsible for typing the text
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTyping, setStartTyping] = useState(false)

  /**
   * Populates the text ref with the text from the stream by iterating over it.
   */
  const populateTextRef = useCallback(async () => {
    console.debug('Populating the text ref...')
    for await (const chunk of stream) {
      textRef.current += chunk
    }
    console.debug('Finished populating the text ref, setting the flag to type')
    setStartTyping(true)
  }, [stream])

  /**
   * The effect response for calling the populate function.
   */
  useEffect(() => {
    console.debug('AsyncTypeWriter is rendered.')
    populateTextRef()

    return () => {
      console.debug('AsyncTypeWriter is cleaned up.')
    }
  }, [populateTextRef])

  /**
   * Actually handles the typing. Note that this does not start typing until the `startTyping` state is set to true.
   */
  useEffect(() => {
    if (!startTyping) return

    console.log('AsyncTypeWriter: Index updated. Typing the next character...')
    let timeout: ReturnType<typeof setTimeout>

    if (currentIndex < textRef.current.length) {
      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + textRef.current[currentIndex])
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, 30)
    } else {
      console.log('AsyncTypeWriter: Finished typing')
      onEndRef.current && onEndRef.current(textRef.current)
    }

    return () => clearTimeout(timeout)
  }, [currentIndex, startTyping])

  return (
    <div>
      <h1>AsyncTypeWriter</h1>
      <p>{currentText}</p>
    </div>
  )
}

export default AsyncTypeWriter
