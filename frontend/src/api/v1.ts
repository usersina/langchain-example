import { AXIOS_INSTANCE } from '.'
import { Message } from '../types/message'
import { getIterableStream } from '../utils/streaming'

/**
 * Send a message to the chatbot API and get the response as a stream.
 *
 * @param prompt The user's prompt
 * @param history the chat history
 * @returns The chatbot's response as a iterable stream
 * @example
 * ```ts
 * const stream = await chatStream('Hello', [])
 * for await (const chunk of stream) {
 *     console.log(chunk)
 * }
 * ```
 */
export const chatStream = async (
  prompt: string,
  history: Message[]
): Promise<AsyncIterable<string>> => {
  const response = await fetch(
    AXIOS_INSTANCE.getUri({
      method: 'POST',
      url: '/v1/chat',
      responseType: 'stream',
    }),
    {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        prompt,
        messages: history.filter(
          (message) => message.role === 'user' || message.role === 'assistant'
        ),
      }),
    }
  )
  // const response = await fetch(
  //   AXIOS_INSTANCE.getUri({
  //     method: 'GET',
  //     url: '/debug/stream/dummy?chunks_amount=5',
  //     responseType: 'stream',
  //   }),
  //   {
  //     method: 'GET',
  //   }
  // )

  if (response.status !== 200) throw new Error(response.status.toString())
  if (!response.body) throw new Error('Response body does not exist')

  return getIterableStream(response.body)
}
