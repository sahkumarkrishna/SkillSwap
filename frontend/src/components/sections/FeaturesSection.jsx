export default function FeaturesSection() {
  const features = [
    {
      icon: '🤝',
      title: 'Instant Collaboration',
      desc: 'Connect instantly with mentors worldwide. Live coding, whiteboarding, and file sharing in one seamless platform.',
      color: 'from-emerald-50 to-teal-50'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      desc: 'Book sessions in seconds. No waiting, no hassle. Start learning immediately with one-click scheduling.',
      color: 'from-violet-50 to-purple-50'
    },
    {
      icon: '💎',
      title: 'Flexible Credit System',
      desc: 'Earn credits by teaching what you know. Spend them learning what you want. Fair, transparent, and rewarding.',
      color: 'from-amber-50 to-orange-50'
    },
    {
      icon: '🎯',
      title: 'Smart Goals',
      desc: 'Set learning objectives and track milestones. AI-powered recommendations keep you on the fastest path.',
      color: 'from-rose-50 to-pink-50'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      desc: 'Learn on the go with our native mobile apps. Seamless sync across all your devices.',
      color: 'from-blue-50 to-indigo-50'
    },
    {
      icon: '🎥',
      title: 'Session Recording',
      desc: 'Never miss a detail. Auto-record sessions and revisit key moments anytime you need.',
      color: 'from-cyan-50 to-blue-50'
    },
    {
      icon: '🏆',
      title: 'Achievements',
      desc: 'Unlock badges, earn rewards, and showcase your learning journey with shareable certificates.',
      color: 'from-fuchsia-50 to-purple-50'
    },
    {
      icon: '🛡️',
      title: 'Privacy & Security',
      desc: 'End-to-end encryption, verified profiles, secure payments, and full GDPR compliance.',
      color: 'from-indigo-50 to-purple-50'
    },
    {
      icon: '🌍',
      title: 'Global Community',
      desc: 'Connect with learners and teachers from 150+ countries worldwide in real-time.',
      color: 'from-green-50 to-emerald-50'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-6">
            <span className="text-sm font-semibold text-gray-700">✨ Features</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
            Built for learners. <span className="text-gray-400">Loved by teachers.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience seamless skill exchange with cutting-edge tools
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${feature.color} rounded-2xl p-8 hover:shadow-xl transition-all group`}>
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-2xl font-black mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2">50K+</div>
              <div className="text-indigo-100 text-sm md:text-base">Active mentors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2">1M+</div>
              <div className="text-indigo-100 text-sm md:text-base">Sessions completed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2">4.9★</div>
              <div className="text-indigo-100 text-sm md:text-base">Average rating</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2">150+</div>
              <div className="text-indigo-100 text-sm md:text-base">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
