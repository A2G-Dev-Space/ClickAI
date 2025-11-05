import { Sparkles } from 'lucide-react'

export default function AIAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white">
      <Sparkles size={20} className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
    </div>
  )
}
