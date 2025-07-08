import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/authcontext'

interface LayoutProps {
  children: ReactNode
  showHeader?: boolean
}

export default function Layout({ children, showHeader = true }: LayoutProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {showHeader && (
        <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div 
                onClick={() => navigate('/dashboard')}
                className="cursor-pointer"
              >
                <div className="w-8 h-8 bg-neutral-900 rounded-full mb-2"></div>
                <h1 className="text-lg font-medium text-neutral-900 tracking-tight">
                  Moments
                </h1>
              </div>
              
              {user && (
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => navigate('/editor')}
                    className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium"
                  >
                    Write
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="text-neutral-500 hover:text-neutral-700 transition-colors text-sm"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}