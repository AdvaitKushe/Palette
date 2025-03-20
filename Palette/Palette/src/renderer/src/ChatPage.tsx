import { DraggableTopBar } from './components/DraggableTopBar'
import { Content, Sidebar } from './components/AppLayout'
import { RootLayout } from './components/AppLayout'
import SignIn from './components/Buttons/SignIn'
import { SideBarActionRow } from './components/SideBarActionRow'
import { GeneratedChat } from './GeneratedChat'
import { UserInputArea } from './components/UserInputArea'
import { ContentActionRow } from './components/Buttons/ContentActionRow'
import { SearchBox } from './components/SearchBox'
import { ChatHistory } from './components/ChatHistory'
import { tokenAtom } from './store'
import { isSearchOpenAtom } from './store'
import { currImageArrayAtom } from './store'
import { useAtom } from 'jotai'
import { useRef } from 'react'

export const ChatPage = () => {
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
            <Sidebar className="relative">
              <SideBarActionRow className="absolute top-0 left-[200px] z-10" />
              <ChatHistory
                className="h-full mt-7"
                contentRef={contentRef}
                onSelect={onSelect}
              />
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
        <SignIn />
      )}
    </>
  )
}
