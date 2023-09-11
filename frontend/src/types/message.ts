/**
 * A message to be displayed in the chat window.
 */
export interface Message {
  role: 'user' | 'assistant' | 'error'
  content: string
}
