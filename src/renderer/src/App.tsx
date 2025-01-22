import { RootLayout, DraggableTopBar, Sidebar, Content } from './components'

const App = () => {
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        
        <Sidebar>This is the sidebar</Sidebar>
        <Content className="border-l bg-zinc-900/50 border-white/20">This is the content</Content>
      </RootLayout>
    </>
  )
}

export default App
