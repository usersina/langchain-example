/**
 * Wait for a given number of milliseconds
 * @param ms The number of milliseconds to wait
 * @returns A promise that resolves after `ms` milliseconds
 */
function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/**
 * Get an async iterable stream from a `ReadableStream`.
 *
 * @param body The `ReadableStream` stream to iterate over.
 * @param delayMs The number of milliseconds to wait before returning each chunk. Defaults to `0`.
 * Note that the delay does not impact the response time of the API. This can be verified in the network tab of the browser's dev tools.
 * @example
 * ```ts
 * const response = await fetch(`/stream`)
 * const stream = getIterableStream(response.body, 200)
 * for await (const chunk of stream) {
 *    console.log(chunk)
 * }
 * ```
 */
export async function* getIterableStream(
  body: ReadableStream<Uint8Array>,
  //   timeout: number = 30000 // 30 seconds
  delayMs: number = 0
): AsyncIterable<string> {
  const reader = body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }
    const decodedChunk = decoder.decode(value, { stream: true })
    if (delayMs) {
      await wait(delayMs)
    }
    yield decodedChunk
  }
}
