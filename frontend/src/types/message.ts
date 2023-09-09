/**
 * A message to be displayed in the chat window.
 */
export interface Message {
  owner: 'ai' | 'human' | 'error'
  text: string
}
