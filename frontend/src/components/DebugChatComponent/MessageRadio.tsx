import { radioItems } from '../../types/radio'

interface MessageRadioProps<T> {
  value: T
  onChange: (value: T) => void
}

function MessageRadio<T>({ value, onChange }: MessageRadioProps<T>) {
  return (
    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex ">
      {radioItems.map((item, index) => (
        <li
          key={index}
          className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r"
        >
          <div className="flex items-center pl-3">
            <input
              id={`message-radio-list-${index}`}
              type="radio"
              value={item.value}
              defaultChecked={item.value === value}
              name="message-radio"
              className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500"
              onChange={(e) => onChange(e.target.value as T)}
            />
            <label
              htmlFor={`message-radio-list-${index}`}
              className="w-full py-3 ml-2 text-sm font-medium text-gray-900"
            >
              {item.name}
            </label>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default MessageRadio
