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
    <div className="min-h-screen bg-champagne_pink-900">
      {showHeader && (
        <header className="border-b border-sage-300/20 bg-champagne_pink-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div 
                onClick={() => navigate('/dashboard')}
                className="cursor-pointer"
              >
                <h1 className="text-2xl font-serif text-reseda_green-100 tracking-tight">
                  Moments
                </h1>
                <p className="text-sm text-sage-400 mt-1">
                  Stories that matter
                </p>
              </div>
              
              {user && (
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => navigate('/editor')}
                    className="text-reseda_green-300 hover:text-reseda_green-100 transition-colors text-sm font-medium"
                  >
                    Write
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="text-sage-400 hover:text-reseda_green-300 transition-colors text-sm"
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