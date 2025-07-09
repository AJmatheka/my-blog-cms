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
    <div className="min-h-screen bg-dark-900">
      {showHeader && (
        <header className="border-b border-dark-700 bg-dark-900/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div 
                onClick={() => navigate('/dashboard')}
                className="cursor-pointer flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent-orange rounded-full"></div>
                  <div className="w-3 h-3 bg-accent-red rounded-full"></div>
                </div>
                <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                  THE CANVAS
                </h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-8">
                <a href="#" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider">
                  Latest
                </a>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider">
                  Trending
                </a>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider">
                  Art
                </a>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider">
                  Music
                </a>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider">
                  Culture
                </a>
              </nav>
              
              {user && (
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => navigate('/editor')}
                    className="bg-accent-orange hover:bg-accent-orange/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Write
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
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
      
      {/* Footer */}
      <footer className="bg-dark-800 border-t border-dark-700 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent-orange rounded-full"></div>
                <div className="w-3 h-3 bg-accent-red rounded-full"></div>
              </div>
              <h2 className="text-2xl font-display font-bold text-white">
                THE CANVAS
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-accent-orange rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">f</span>
              </div>
              <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">t</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">About</h3>
              <p className="text-neutral-400 leading-relaxed">
                A blog about art, culture, and creative expression. Discover stories that inspire and connect.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Categories</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Art</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Music</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Culture</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Photography</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Resources</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Connect</h3>
              <p className="text-neutral-400 mb-4">Stay updated with our latest stories</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 bg-dark-700 border border-dark-600 text-white placeholder-neutral-400 px-3 py-2 rounded text-sm focus:border-accent-orange focus:outline-none"
                />
                <button className="bg-accent-orange hover:bg-accent-orange/90 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-dark-700 mt-8 pt-8 text-center text-neutral-500 text-sm">
            <p>&copy; 2024 The Canvas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}