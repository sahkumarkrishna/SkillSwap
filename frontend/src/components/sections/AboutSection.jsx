import { Link } from 'react-router-dom';

export default function AboutSection() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-400 rounded-full filter blur-[120px] opacity-20"></div>
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-400 rounded-full filter blur-[120px] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Text Content */}
          <div className="order-1 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-700">About SkillSwap</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              The future of
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                learning & teaching
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              SkillSwap transforms how people share knowledge. We've built a revolutionary credit-based platform where your expertise becomes currency.
            </p>

            {/* Key Points */}
            <div className="space-y-6 mb-10">
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Instant Matching</h3>
                  <p className="text-gray-600">AI-powered algorithm connects you with perfect mentors in seconds. No waiting, no hassle.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Fair Credit System</h3>
                  <p className="text-gray-600">Earn 10 credits teaching, spend 10 learning. Perfectly balanced. Start with 50 free credits.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Verified & Secure</h3>
                  <p className="text-gray-600">All users verified. Bank-level encryption. Your data and sessions are always protected.</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all">
                <span>Get Started Free</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/skills" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all">
                <span>Browse Skills</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">10,000+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">50K+ Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">4.9★ Rating</span>
              </div>
            </div>
          </div>

          {/* Right: Image/Visual */}
          <div className="relative lg:scale-110 order-2 lg:order-2">
            {/* Browser Mockup */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-20"></div>
              
              {/* Browser Window */}
              <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                {/* Browser Header */}
                <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 mx-4 bg-white rounded px-3 py-1 text-xs text-gray-500">
                    skillswap.com/dashboard
                  </div>
                </div>

                {/* Browser Content */}
                <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="text-3xl font-black text-green-600">+150</div>
                      <div className="text-sm text-gray-600">Credits Earned</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="text-3xl font-black text-blue-600">12</div>
                      <div className="text-sm text-gray-600">Skills Learned</div>
                    </div>
                  </div>

                  {/* Activity List */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        JS
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">JavaScript Basics</div>
                        <div className="text-xs text-gray-500">with Sarah M.</div>
                      </div>
                      <div className="text-sm font-semibold text-green-600">+10</div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        UI
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">UI Design Pro</div>
                        <div className="text-xs text-gray-500">with Mike K.</div>
                      </div>
                      <div className="text-sm font-semibold text-blue-600">-10</div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        PY
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">Python Mastery</div>
                        <div className="text-xs text-gray-500">with Alex T.</div>
                      </div>
                      <div className="text-sm font-semibold text-green-600">+10</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-8 -right-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-xs text-gray-500">Live Now</p>
                  <p className="text-base font-bold text-gray-900">2,847 online</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-xl">
              <div className="text-center">
                <p className="text-4xl font-black text-blue-600">4.9★</p>
                <p className="text-xs text-gray-500">8K+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
