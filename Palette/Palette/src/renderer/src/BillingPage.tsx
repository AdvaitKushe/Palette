import { DraggableTopBar } from './components/DraggableTopBar'
import { userAtom, tokenAtom } from './store'
import { useAtom } from 'jotai'

import { BackToChat } from './components/Buttons/BackToChat'
import { UpgradeSubscription } from './components/UpgradeSubscription'
import { Dashboard } from './components/Dashboard'
import SignIn from './components/Buttons/SignIn'
export const BillingPage = () => {
  const [token] = useAtom(tokenAtom)
  const [user] = useAtom(userAtom)
  const profileImage = user?.picture || '/default-avatar.png'
  return (

    <>
      <DraggableTopBar />
      {token ? (
      <div className="flex flex-col items-start p-10">
        <BackToChat />

        <div className="flex flex-row items-start gap-20 ml-20 mt-20">
          <div className="flex flex-col items-center gap-2">
            <img
              src={profileImage}
              alt="Profile"
              className="profile-image rounded-full w-[150px] h-[150px]"
              onError={(e) => {
                e.currentTarget.src = '/default-avatar.png'
              }}
            />
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <h1 className="text-sm text-zinc-400">{user?.email}</h1>
              <div className="flex flex-row items-center justify-center w-full">
                <div
                  className={`px-2 py-2 rounded-md  ${user?.subscription ? 'border-green-500 text-green-500' : 'border-zinc-500 text-zinc-500'}`}
                >
                  <h1 className="text-sm font-bold bg-zinc-900/50 px-2 py-1 rounded-md text-zinc-400">
                    {user?.subscription ? 'Active' : 'Inactive'}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {user?.subscription ? <Dashboard /> : <UpgradeSubscription />}
        </div>
      </div>
      ) : (
        <SignIn />
      )}
    </>
  )
}
