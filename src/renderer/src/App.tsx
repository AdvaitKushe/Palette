import { RootLayout, DraggableTopBar, Sidebar, Content, SideBarActionRow } from './components'
import { ContentActionRow } from './components/Buttons/ContentActionRow'
import { ChatHistory } from './components/ChatHistory'
import { UserInputArea } from './components/UserInputArea'
import { GeneratedChat } from './GeneratedChat'
import SignIn from './components/Buttons/SignIn'
import { useAtom } from 'jotai'
import { tokenAtom } from './store'

const App = () => {
  const [token] = useAtom(tokenAtom)
  console.log('token', token)

  return (
    <>
      <DraggableTopBar />
      {token ? (
        <>
          <RootLayout className="">
            <Sidebar>
              <SideBarActionRow className="flex justify-end mt-1 mb-5" />
              <ChatHistory />
            </Sidebar>

            <Content className="border-l bg-zinc-900/50 border-white/20 flex flex-col p-2 h-screen">
              <ContentActionRow />
              <GeneratedChat className="ml-2 mr-2 flex-grow overflow-auto" />

              <UserInputArea className="mt-auto" />
            </Content>
          </RootLayout>
        </>
      ) : (
        <SignIn  />
      )}
    </>
  )
}

export default App
