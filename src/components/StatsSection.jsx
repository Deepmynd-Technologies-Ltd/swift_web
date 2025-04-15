import { useEffect, useState } from "react";

const StatCard = ({ value, label, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // Animation duration in ms
    const steps = 40; // Total animation steps
    const stepValue = value / steps;
    const stepTime = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current > value) {
        current = value;
        clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 gradient-text">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </h3>
      <p className="text-white/70">{label}</p>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-swiftaza-darker/50 backdrop-blur-sm -z-10"></div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="glass-card p-10 md:p-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Trusted by Traders Worldwide</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={250} suffix="K+" label="Active Users" />
            <StatCard value={10} suffix="B+" label="Trading Volume" prefix="$" />
            <StatCard value={120} suffix="+" label="Countries" />
            <StatCard value={99.9} suffix="%" label="Uptime" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
