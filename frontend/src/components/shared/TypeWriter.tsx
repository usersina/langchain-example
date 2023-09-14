import { useEffect, useRef, useState } from 'react'

interface TypeWriterProps {
  text: string
  wrapperClassName?: string
  className?: string
  delay?: number
  onFinish?: (message: string) => void
}

function TypeWriter({
  text,
  /**
   * The delay between each character in milliseconds. Default is 20.
   */
  delay = 200,
  wrapperClassName,
  className,
  onFinish,
}: TypeWriterProps) {
  const scrollTargetRef = useRef<HTMLDivElement>(null)
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  const abortTimerRef = useRef<number | null>(null) // we can save timer in useRef and pass it to child

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let abort = abortTimerRef.current

    if (currentIndex < text.length) {
      // This works without the clear because the timeout is cleared and set again on each render.
      //
      // We received a new character, we cancel the previous timeout that would
      // finish the typing and call on the onFinish callback.
      // if (abort) {
      //   console.debug(
      //     'TypeWriter: Got new characters, clearing the abort counter.'
      //   )
      //   clearTimeout(abort)
      // }

      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex])
        setCurrentIndex((prevIndex) => prevIndex + 1)

        // TODO: Don't scroll if the user is scrolling up
        scrollTargetRef.current?.scrollIntoView({ behavior: 'instant' })
      }, delay)
    } else {
      // If current index is equal to the text length, then we are either done typing
      // or the buffer reached the end of the message. We still want to wait for a bit
      // in case the buffer is still receiving data.
      console.debug(
        'TypeWriter: Texts are equal, starting the abort counter...'
      )
      abort = setTimeout(() => {
        console.debug('TypeWriter: Abort counter finished, calling onFinish.')
        if (onFinish) onFinish(currentText)
      }, 1000)
    }

    return () => {
      console.debug('TypeWriter: Clearing timeout and abort counters.')
      clearTimeout(timeout)
      if (abort) clearTimeout(abort)
    }
  }, [currentIndex, currentText, delay, text, onFinish])

  return (
    <div className={wrapperClassName}>
      <p className={className}>{currentText}</p>
      <div ref={scrollTargetRef} />
    </div>
  )
}

export default TypeWriter
