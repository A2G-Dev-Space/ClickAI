import { useEffect } from 'react'
import ChatView from './components/ChatView'
import { useChatStore } from './store/chatStore'

function App() {
  const createNewSession = useChatStore((state) => state.createNewSession)

  useEffect(() => {
    // Create initial session on mount
    createNewSession()
  }, [createNewSession])

  return <ChatView />
}

export default App
