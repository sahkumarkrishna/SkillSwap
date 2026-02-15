export default function AdminStatsCard({ icon: Icon, title, value, color, borderColor }) {
  return (
    <div className={`group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all p-8 border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-bold mb-2">{title}</h3>
      <p className={`text-4xl font-black ${color.replace('from-', 'text-').replace(' to-', '').split(' ')[0]}`}>{value}</p>
    </div>
  );
}
