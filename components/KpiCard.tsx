interface KpiCardProps {
  label: string;
  value: string | number;
  delta: number;
  deltaType: "up" | "down";
  accentColor: "gold" | "teal" | "blue" | "rose";
}

export default function KpiCard({ label, value, delta, deltaType, accentColor }: KpiCardProps) {
  const accentClasses = {
    gold: "accent-gold",
    teal: "accent-teal",
    blue: "accent-blue",
    rose: "accent-rose",
  };

  const deltaColor = deltaType === "up" ? "text-emerald-500" : "text-red-500";
  const deltaIcon = deltaType === "up" ? "↑" : "↓";

  return (
    <div
      className={`bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border ${accentClasses[accentColor]} focus:outline-none focus:ring-2 focus:ring-aura-gold focus:ring-offset-2 dark:focus:ring-offset-aura-dark`}
      tabIndex={0}
      role="article"
      aria-label={`${label}: ${value}, ${deltaType === "up" ? "increased" : "decreased"} by ${Math.abs(delta)}%`}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="font-serif text-3xl text-gray-900 dark:text-white mb-2">{value}</p>
      <div className={`text-sm font-medium ${deltaColor}`}>
        <span className="mr-1" aria-hidden="true">{deltaIcon}</span>
        <span>{Math.abs(delta)}%</span>
        <span className="text-gray-400 ml-1">vs last period</span>
      </div>
    </div>
  );
}