export default function StatsCard({ icon: Icon, title, value, color, gradient }) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all p-8 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-bold mb-2">{title}</h3>
      <p className={`text-4xl font-black ${color}`}>{value}</p>
    </div>
  );
}
