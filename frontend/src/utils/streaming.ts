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
  body: ReadableStream<Uint8Array>
  //   timeout: number = 30000 // 30 seconds
): AsyncIterable<string> {
  const reader = body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }
    const decodedChunk = decoder.decode(value, { stream: true })
    yield decodedChunk
  }
}
