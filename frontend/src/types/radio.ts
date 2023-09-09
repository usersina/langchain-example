import { ElementType } from './utils'

export const radioItems = [
  {
    name: 'Generative',
    value: 'generate',
  },
  {
    name: 'SQL Agent',
    value: 'sql',
  },
] as const

export type RadioValue = ElementType<typeof radioItems>['value']
