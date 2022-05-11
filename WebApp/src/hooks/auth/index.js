import React from 'react'
import { useRecoilState, atom } from 'recoil'
import jwtDecode from 'jwt-decode'

export const authStateAtom = atom({
  key: 'authState',
  default: {
    isLoading: true,
    accessToken: null,
    isLoggedIn: false,
  },
})

export function useAuth() {
  const [authState, setAuthState] = useRecoilState(authStateAtom)

  React.useEffect(() => {
    const token = localStorage.getItem('token-cotrugli')

    if (!token) {
      return setAuthState({
        isLoading: false,
        accessToken: null,
        isLoggedIn: false,
      })
    }

    const decodedToken = jwtDecode(token)

    const dateNow = new Date()

    if (decodedToken.exp * 1000 < dateNow.getTime()) {
      return setAuthState({
        isLoading: false,
        accessToken: null,
        isLoggedIn: false,
      })
    }

    return setAuthState({ isLoading: false, accessToken: token, isLoggedIn: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [authState]
}

export function useLogout() {
  const logout = () => {
    localStorage.removeItem('token-cotrugli')

    document.location.href = ''
  }

  return { logout }
}
