import { useEffect, useState } from 'react'
import ChatView from './components/ChatView'
import HistoryView from './components/HistoryView'
import SettingsView from './components/SettingsView'
import { useChatStore } from './store/chatStore'

type View = 'chat' | 'history' | 'settings'

function App() {
  const [currentView, setCurrentView] = useState<View>('chat')
  const createNewSession = useChatStore((state) => state.createNewSession)

  useEffect(() => {
    // Create initial session on mount
    createNewSession()
  }, [createNewSession])

  const renderView = () => {
    switch (currentView) {
      case 'history':
        return <HistoryView onBack={() => setCurrentView('chat')} />
      case 'settings':
        return <SettingsView onBack={() => setCurrentView('chat')} />
      case 'chat':
      default:
        return (
          <ChatView
            onShowHistory={() => setCurrentView('history')}
            onShowSettings={() => setCurrentView('settings')}
          />
        )
    }
  }

  return <>{renderView()}</>
}

export default App
