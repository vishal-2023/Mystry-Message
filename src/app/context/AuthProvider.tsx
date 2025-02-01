import { SessionProvider } from "next-auth/react"
import React from 'react'

type AuthProviderProps = {
    children: React.ReactNode; 
  };

const AuthProvider : React.FC<AuthProviderProps> = ({ children }) => {


  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default AuthProvider;