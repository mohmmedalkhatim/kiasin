export default function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 bg-none">
      <span className="text-support-500">{icon}</span>
      <h2 className="text-xs font-semibold text-support-500 uppercase tracking-widest">{label}</h2>
    </div>
  )
}
