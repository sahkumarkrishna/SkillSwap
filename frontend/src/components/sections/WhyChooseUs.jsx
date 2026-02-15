import { Users, Clock, Award, TrendingUp, Video, Shield, Globe, Zap } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    { 
      icon: Users, 
      title: 'Learn from Experts', 
      desc: 'Connect with verified mentors who have real-world experience in their fields',
      color: 'from-blue-500 to-indigo-500'
    },
    { 
      icon: Clock, 
      title: 'Flexible Scheduling', 
      desc: 'Book sessions that fit your schedule, available 24/7 across all timezones',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: Award, 
      title: 'Earn While Teaching', 
      desc: 'Share your expertise and earn credits that you can use to learn new skills',
      color: 'from-amber-500 to-orange-500'
    },
    { 
      icon: TrendingUp, 
      title: 'Track Your Progress', 
      desc: 'Monitor your learning journey with detailed analytics and achievement badges',
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      icon: Video, 
      title: 'HD Video Sessions', 
      desc: 'Crystal-clear video calls with screen sharing and real-time collaboration tools',
      color: 'from-rose-500 to-red-500'
    },
    { 
      icon: Shield, 
      title: 'Secure & Private', 
      desc: 'Bank-level encryption and verified profiles ensure your safety and privacy',
      color: 'from-cyan-500 to-blue-500'
    },
    { 
      icon: Globe, 
      title: 'Global Community', 
      desc: 'Connect with learners and teachers from 150+ countries worldwide',
      color: 'from-violet-500 to-purple-500'
    },
    { 
      icon: Zap, 
      title: 'Instant Matching', 
      desc: 'AI-powered algorithm finds the perfect mentor for you in seconds',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Why SkillSwap
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            The smarter way to <span className="text-blue-600">learn & teach</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of learners and teachers exchanging skills every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {reasons.map((reason, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all hover:shadow-xl group"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className={`bg-gradient-to-br ${reason.color} p-3 md:p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                  <reason.icon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900">{reason.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{reason.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-100 text-sm md:text-base">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">1M+</div>
              <div className="text-blue-100 text-sm md:text-base">Sessions</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">150+</div>
              <div className="text-blue-100 text-sm md:text-base">Countries</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">4.9★</div>
              <div className="text-blue-100 text-sm md:text-base">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}