import { RootSignIn } from '../AppLayout'
import { ActionButton } from './ActionButton'
import { tokenAtom, userIDAtom, loadNotesAtom } from '@renderer/store'
import { useAtom } from 'jotai'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@renderer/firebase/fire'
//import { useEffect } from 'react'
import { userAtom } from '@renderer/store'

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
  const [, loadNotes] = useAtom(loadNotesAtom)
  const [, setUser] = useAtom(userAtom)

  //TODO: Comment out before production builds
  // useEffect(() => {
  //   const init = async () => {
  //     const token =
  //       'ya29.a0AXeO80Sz2m9qHrFQTXYtkan7mhK31Lw2mD5hvKjMOBIumh6rMRjhpHnA4YIjSxrLrGXP_iE7qU8gIdRDh1-Hlk_kJrAclahEDBY2xvbevd_zxoHLPODeytapRs_FWKNVwZD7FZsJWPE4JAzJ9hXzBBnL8NhvkflREQITwY48ZwaCgYKAb4SARESFQHGX2MivHZywho5jOVSPMeZKYOtLA0177'

  //     try {
  //       const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       })

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch user info')
  //       }

  //       const userInfo: GoogleUserInfo = await response.json()
  //       setUser(userInfo)

  //       // You might want to store user info in state or context
  //       if (userInfo.id) {
  //         setUserID(userInfo.id)
  //         const docRef = doc(db, 'users', userInfo.id)
  //         if (docRef == null) {
  //           await setDoc(docRef, {
  //             settings: {
  //               email: userInfo.email,
  //               name: userInfo.name,
  //               picture: userInfo.picture
  //             }
  //           })
  //         } else {
  //           console.log('User document already exists')
  //         }
  //         setToken(token)
  //         await loadNotes()
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user info:', error)
  //     }
  //   }
  //   init()
  // }, [])

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
      setUser(userInfo)

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
        setToken(token)
        await loadNotes()
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  })

  function signIn() {
    window.electron.auth.openExternal('https://palette-login.vercel.app/')
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
