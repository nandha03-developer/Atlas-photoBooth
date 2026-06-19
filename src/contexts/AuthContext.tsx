// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
// import authConfig from 'src/configs/auth'
import authConfig from "../configs/auth"

// ** Types
import { AuthValuesType, UserDataType, LoginParams } from './types'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
import crypto from 'crypto'
import toast from 'react-hot-toast'
// import { fetchData } from 'src/pages/api/adminProfile'
//import crypto from 'crypto';

// Replace these values with your Cognito User Pool details
const CLIENT_ID = '2dilsnnsd6acp0mme9gfgig32o' // Replace with your Cognito App Client ID
const CLIENT_SECRET = '1i13gnm003mal8n8baqbk8ltisa0efe3pcb43itdhai2dui7g4r4' // Replace with your Cognito App Client Secret
//const AWS_REGION = 'ap-south-1'; // Replace with your AWS region

const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-2' })

// AWS.config.update({
//   region: AWS_REGION,
// });

const generateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64')
}

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // const [groupData, setGroupData] = useState<any>([])

  // ** Hooks
  const router = useRouter()

 
  const handleLogin = async (params: LoginParams) => {
   

    const secretHash = generateSecretHash(params.email, CLIENT_ID, CLIENT_SECRET)

    try {
      const response = await cognito
        .initiateAuth({
          AuthFlow: 'USER_PASSWORD_AUTH',
          AuthParameters: {
            USERNAME: params.email,
            PASSWORD: params.password,
            SECRET_HASH: secretHash
          },
          ClientId: '2dilsnnsd6acp0mme9gfgig32o' // Replace with your actual Cognito User Pool Client ID
        })
        .promise()

      
      const token: any = response?.AuthenticationResult?.AccessToken
      localStorage.setItem(authConfig.storageTokenKeyName, token)

      

      const userResponseData: any = {
        email: params.email,
        password: params.password
      }
     
      params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(userResponseData)) : null

      setUser(userResponseData)
      toast.success('Login successful')
      router.replace('/transactions/addon')
      const returnUrl = router.query.returnUrl || '/'
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
      setLoading(false)
    } catch (error) {
      alert('Sign-in failed Invalid user name or password')

      console.error('Error signing in:', error)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values: AuthValuesType = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
