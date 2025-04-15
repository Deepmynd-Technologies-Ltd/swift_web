import { CircleUser, Wallet, BarChart3 } from "lucide-react";

const Step = ({ number, icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-swiftaza-purple to-swiftaza-blue flex items-center justify-center">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <span className="text-xs font-bold text-swiftaza-purple">{number}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: CircleUser,
      title: "Create Your Account",
      description: "Sign up in minutes with our simple onboarding process. Verify your identity to unlock all features.",
    },
    {
      icon: Wallet,
      title: "Fund Your Wallet",
      description: "Deposit cryptocurrency or fiat currency using multiple payment methods tailored to your region.",
    },
    {
      icon: BarChart3,
      title: "Start Trading",
      description: "Access our intuitive trading interface and execute trades with real-time market data and insights.",
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">How It Works</h2>
        <div className="space-y-12">
          {steps.map((step, index) => (
            <Step
              key={index}
              number={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
