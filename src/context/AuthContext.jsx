
'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'

import {
  login as apiLogin,
  setToken,
  clearToken,
  getToken,
} from '../services/api.js'

const USER_KEY = 'deppi.usuario'

const AuthCtx = createContext(null)

export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    try {
      if (getToken()) {
        const salvo = localStorage.getItem(USER_KEY)
        if (salvo) setUsuario(JSON.parse(salvo))
      }
    } catch {
      clearToken()
      localStorage.removeItem(USER_KEY)
    } finally {
      setCarregando(false)
    }
  }, [])

  const entrar = useCallback(async (email, senha) => {
    const { token, usuario: u } = await apiLogin(email, senha)

    if (!token) {
      throw new Error('A API não devolveu um token.')
    }

    setToken(token)
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUsuario(u)

    return u
  }, [])

  const sair = useCallback(() => {
    clearToken()
    localStorage.removeItem(USER_KEY)
    setUsuario(null)
  }, [])

  return (
    <AuthCtx.Provider value={{ usuario, entrar, sair, carregando }}>
      {children}
    </AuthCtx.Provider>
  )
}
