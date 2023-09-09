import axios from 'axios'

const AXIOS_INSTANCE = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Generate a response from the API given a prompt.
 *
 * @param prompt The user's prompt
 * @param temperature Randomness of the response
 * @param topP top-p sampling
 * @param maxLength The maximum length of the response
 * @throws `Error` if the response status is not 200
 * @see https://community.openai.com/t/cheat-sheet-mastering-temperature-and-top-p-in-chatgpt-api-a-few-tips-and-tricks-on-controlling-the-creativity-deterministic-output-of-prompt-responses/172683
 * @returns The generated response
 */
export const generate = async (
  prompt: string,
  temperature = 0.9,
  topP = 1,
  maxLength = 100
): Promise<[string, number]> => {
  const response = await AXIOS_INSTANCE.post<{
    output: string
    tokens: number
  }>(
    '/generate',
    {
      prompt,
    },
    {
      params: {
        temperature,
        top_p: topP,
        max_length: maxLength,
      },
    }
  )
  if (response.status !== 200) throw new Error(response.statusText)
  return [response.data.output, response.data.tokens]
}

/**
 * Generate a response from a user's prompt using the SQL agent.
 * @param prompt The user's prompt
 * @returns The generated response
 */
export const sqlQueryAgent = async (
  prompt: string
): Promise<[string, number]> => {
  const response = await AXIOS_INSTANCE.post<{
    output: string
    tokens: number
  }>('/sql/agent', {
    prompt,
  })
  if (response.status !== 200) throw new Error(response.statusText)
  return [response.data.output, response.data.tokens]
}
