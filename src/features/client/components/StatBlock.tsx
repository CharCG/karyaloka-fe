interface StatBlockProps {
  label: string;
  value: number | string;
}

export default function StatBlock({ label, value }: StatBlockProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-1">
      <span className="text-caption font-medium text-text-secondary">{label}</span>
      <span className="text-h2 font-bold text-text-primary mt-1">{value}</span>
    </div>
  );
}
