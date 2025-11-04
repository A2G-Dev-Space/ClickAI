export default function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center space-x-2 py-2" role="status" aria-label="로딩 중">
      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} aria-hidden="true"></div>
      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} aria-hidden="true"></div>
      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} aria-hidden="true"></div>
      <span className="sr-only">AI가 응답을 생성하는 중입니다...</span>
    </div>
  )
}
