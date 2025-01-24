import { twMerge } from 'tailwind-merge'
import ModelChoice from './ModelChoice'

export const ModelDropdown = ({
  onModelSelect,
  className
}: {
  onModelSelect: (model: string, company: string) => void
  className?: string
}) => {
  return (
    <div
      className={twMerge(
        'absolute left-0 top-full mt-2 bg-zinc-900/30 rounded-lg p-2 shadow-lg w-[200px]',
        className
      )}
    >
      <ModelChoice
        className="w-full"
        company="OpenAI"
        children={['GPT-4o', 'GPT-4o mini', 'GPT-o1', 'GPT-o1 mini']}
        onModelSelect={onModelSelect}
      />
      <ModelChoice
        className="w-full"
        company="Anthropic"
        children={[
          'Claude 3.5 Haiku',
          'Claude 3.5 Sonnet',
          
        ]}
        onModelSelect={onModelSelect}
      />
      <ModelChoice
        className="w-full"
        company="Google"
        children={['Gemini 1.5 Flash', 'Gemini 1.5 Pro']}
        onModelSelect={onModelSelect}
      />
      <ModelChoice
        className="w-full"
        company="Meta"
        children={['Llama 3.1']}
        onModelSelect={onModelSelect}
      />
    </div>
  )
}
