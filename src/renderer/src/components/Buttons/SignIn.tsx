import { RootSignIn } from '../AppLayout'
import { ActionButton } from './ActionButton'
import { tokenAtom, userIDAtom } from '@renderer/store'
import { useAtom } from 'jotai'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@renderer/firebase/fire'

interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

export default function SignIn() {
  const [, setToken] = useAtom(tokenAtom)
  const [, setUserID] = useAtom(userIDAtom)

  window.electron.auth.on('send-token', async function (token) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user info')
      }

      const userInfo: GoogleUserInfo = await response.json()

      // You might want to store user info in state or context
      if (userInfo.id) {
        setUserID(userInfo.id)
        const docRef = doc(db, 'users', userInfo.id)
        if (docRef == null) {
          await setDoc(docRef, {
            settings: {
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture
            }
          })
        } else {
          console.log('User document already exists')
        }
      }

      setToken(token)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  })

  function signIn() {
    window.electron.auth.openExternal('http://localhost:5173/')
  }

  return (
    <RootSignIn className="flex items-center justify-center">
      <div className="flex flex-col justify-center items-center pl-10 pr-10 pt-5 pb-5 w-[300px] h-[300px] shadow-lg bg-zinc-900/50 rounded-lg shadow-zinc-900/50">
        <div className="text-xl font-bold text-center mb-6">Welcome to Palette</div>
        <ActionButton className="" onClick={() => signIn()}>
          <i className="bi bi-google mr-2"></i>
          Sign in with Google
        </ActionButton>
      </div>
    </RootSignIn>
  )
}
