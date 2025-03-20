import { useNavigate } from 'react-router-dom'
export const BackToChat = () => {
  const navigate = useNavigate()
  return (
    <h1
      className="text-md font-bold text-zinc-400 underline cursor-pointer hover:text-zinc-300 transition-all duration-300"
      onClick={() => {
        navigate('/')
      }}
    >
      <i className="bi bi-arrow-left-short text-sm"> Back to Chat</i>
    </h1>
  )
}
