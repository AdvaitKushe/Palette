import { RootLayout, DraggableTopBar, Sidebar, Content, SideBarActionRow } from './components'
import { ContentActionRow } from './components/Buttons/ContentActionRow'
import { ChatHistory } from './components/ChatHistory'
import { UserInputArea } from './components/UserInputArea'
import { GeneratedChat } from './GeneratedChat'

const App = () => {
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
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
  )
}

export default App
