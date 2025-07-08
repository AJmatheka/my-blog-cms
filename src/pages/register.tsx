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
    <div className="min-h-screen bg-champagne_pink-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif text-reseda_green-100 mb-2">
            Start your journey
          </h1>
          <p className="text-sage-400">
            Create an account to begin writing
          </p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <input
              className="w-full bg-champagne_pink-800/30 border border-sage-300/20 rounded-lg px-4 py-3 text-reseda_green-100 placeholder-sage-400 focus:outline-none focus:border-buff-400 transition-colors"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <input
              className="w-full bg-champagne_pink-800/30 border border-sage-300/20 rounded-lg px-4 py-3 text-reseda_green-100 placeholder-sage-400 focus:outline-none focus:border-buff-400 transition-colors"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-buff-500 hover:bg-buff-400 text-champagne_pink-900 py-3 rounded-lg font-medium transition-colors"
          >
            Create account
          </button>
        </form>
        
        <p className="text-center mt-8 text-sage-400">
          Already have an account?{' '}
          <Link to="/login" className="text-buff-400 hover:text-buff-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
