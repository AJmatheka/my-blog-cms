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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-16">
          <div className="w-12 h-12 bg-neutral-900 rounded-full mx-auto mb-8"></div>
          <h1 className="text-4xl font-light text-neutral-900 mb-4">
            Start your journey
          </h1>
          <p className="text-neutral-600 text-lg">
            Create an account to begin writing
          </p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <input
              className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-neutral-900 transition-colors text-lg"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <input
              className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-neutral-900 transition-colors text-lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-neutral-900 hover:bg-neutral-700 text-white py-4 rounded-full font-medium transition-colors text-lg"
          >
            Create account
          </button>
        </form>
        
        <p className="text-center mt-12 text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="text-neutral-900 hover:text-neutral-600 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}