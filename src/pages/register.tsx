import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-4 h-4 bg-accent-orange rounded-full"></div>
            <div className="w-4 h-4 bg-accent-red rounded-full"></div>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            THE CANVAS
          </h1>
          <p className="text-neutral-400 text-lg">
            Join our creative community
          </p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="bg-accent-red/10 border border-accent-red/20 text-accent-red px-6 py-4 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-neutral-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              className="w-full magazine-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-neutral-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              className="w-full magazine-input"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full magazine-button py-4 text-lg"
          >
            Create Account
          </button>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-orange hover:text-accent-orange/80 transition-colors font-medium">
              Sign in here
            </Link>
          </p>
        </div>
        
        <div className="border-t border-dark-700 mt-12 pt-8 text-center">
          <p className="text-neutral-500 text-sm">
            Start sharing your stories with the world
          </p>
        </div>
      </div>
    </div>
  )
}