export default function StatsSection() {
  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '1M+', label: 'Sessions Completed' },
    { number: '150+', label: 'Countries Worldwide' },
    { number: '4.9/5', label: 'Average Rating' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-blue-600">thousands worldwide</span>
          </h2>
          <p className="text-lg text-gray-600">
            Join a thriving community of learners and teachers
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">Trusted by learners from</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'].map((company, idx) => (
              <div key={idx} className="text-2xl font-bold text-gray-900">{company}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
