import { RootLayout, DraggableTopBar, Sidebar, Content, SideBarActionRow, SearchBox } from './components'
import { ContentActionRow } from './components/Buttons/ContentActionRow'
import { ChatHistory } from './components/ChatHistory'
import { UserInputArea } from './components/UserInputArea'
import { GeneratedChat } from './GeneratedChat'
import SignIn from './components/Buttons/SignIn'
import { useAtom } from 'jotai'
import { currImageArrayAtom, isSearchOpenAtom, tokenAtom } from './store'
import { useRef } from 'react'

const App = () => {
  const [token] = useAtom(tokenAtom)
  const contentRef = useRef<HTMLDivElement>(null)
  const [, setCurrImageArray] = useAtom(currImageArrayAtom)
  const [isSearchOpen] = useAtom(isSearchOpenAtom)
  const onSelect = () => {
    
    setCurrImageArray([])
  }
  
  return (
    <>
      <DraggableTopBar />
      {token ? (
        <>
          <RootLayout className="">
            <Sidebar className="">
              <SideBarActionRow className="flex justify-end mt-1 " />
              <ChatHistory contentRef={contentRef} onSelect={onSelect} />
            </Sidebar>
            <Content className="border-l bg-zinc-900/50 border-white/20 flex flex-col p-2 h-screen">
              <ContentActionRow />
              <GeneratedChat className="ml-2 mr-2 flex-grow overflow-auto mb-10" />
              <UserInputArea className="mt-auto" contentRef={contentRef} />
              {isSearchOpen && <SearchBox />}
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
