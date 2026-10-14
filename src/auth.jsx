import { createContext, useContext, useState, useCallback } from 'react'
import { login as apiLogin, setToken, clearToken, getToken } from './api.js'

const USER_KEY = 'deppi.usuario'
const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try { return getToken() ? JSON.parse(localStorage.getItem(USER_KEY)) : null } catch { return null }
  })

  const entrar = useCallback(async (email, senha) => {
    const { token, usuario: u } = await apiLogin(email, senha)
    if (!token) throw new Error('A API não devolveu um token.')
    setToken(token)
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUsuario(u)
    return u
  }, [])

  const sair = useCallback(() => {
    clearToken(); localStorage.removeItem(USER_KEY); setUsuario(null)
  }, [])

  return <AuthCtx.Provider value={{ usuario, entrar, sair }}>{children}</AuthCtx.Provider>
}
