function MessageLoading() {
  return (
    <div className="w-fit">
      <p className="p-2 whitespace-pre-wrap bg-gray-100 rounded-lg">
        <span className="inline-block w-1 h-1 mr-2 bg-gray-300 rounded-full animate-pulse"></span>
        <span className="inline-block w-1 h-1 mr-2 bg-gray-300 rounded-full animate-pulse"></span>
        <span className="inline-block w-1 h-1 mr-2 bg-gray-300 rounded-full animate-pulse"></span>
      </p>
    </div>
  )
}

export default MessageLoading
