import { ArrowRight, CreditCard, Zap, Unlink } from 'lucide-react'
import { Button } from './ui/button'

export const UpgradeSubscription = () => {
  return (
    <div>
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Zap className="h-8 w-8 text-yellow-400" />}
          title="Lightning Fast"
          description="Experience rapid responses with our optimized cloud processing."
        />
        <FeatureCard
          icon={<Unlink className="h-8 w-8 text-blue-400" />}
          title="Flexible LLM Choices"
          description="Flexibility to choose without being tied to a single provider."
        />
        <FeatureCard
          icon={<CreditCard className="h-8 w-8 text-green-400" />}
          title="Pay Per Use"
          description="Only pay for what you need with our flexible usage-based pricing."
        />
      </section>
      <section className="text-center mt-10">
        <p className="text-xl mb-4">
          Get unlimited access to our powerful cloud-based AI chat for just
          <span className="text-2xl font-bold text-green-400"> $1.50/month</span>
          <span className="text-gray-400"> + pay-per-use</span>
        </p>
        <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
          Upgrade Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 text-center transition-all duration-300 hover:bg-zinc-500">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  )
}

function ComparisonItem({ feature, pro, trial }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-700 py-2">
      <span className="font-medium">{feature}</span>
      <div className="flex gap-4">
        <span className="text-green-400">{pro}</span>
        <span className="text-gray-400">{trial}</span>
      </div>
    </div>
  )
}
