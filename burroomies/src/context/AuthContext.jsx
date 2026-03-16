import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null)
  const [token, setToken] = useState(null)
  const [rol,   setRol]   = useState(null)

  useEffect(() => {
    const savedToken = localStorage.getItem("burroomies_token")
    const savedUser  = localStorage.getItem("burroomies_user")
    const savedRol   = localStorage.getItem("burroomies_rol")
    if (savedToken) setToken(savedToken)
    if (savedUser)  setUser(JSON.parse(savedUser))
    if (savedRol)   setRol(savedRol)
  }, [])

  const login = (userData, tokenData, rolData) => {
    setUser(userData)
    setToken(tokenData)
    setRol(rolData)
    localStorage.setItem("burroomies_token", tokenData)
    localStorage.setItem("burroomies_user",  JSON.stringify(userData))
    localStorage.setItem("burroomies_rol",   rolData)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setRol(null)
    localStorage.removeItem("burroomies_token")
    localStorage.removeItem("burroomies_user")
    localStorage.removeItem("burroomies_rol")
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ user, token, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}