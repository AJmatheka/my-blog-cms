// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/authcontext"

import type { ReactNode } from "react"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return children
}
