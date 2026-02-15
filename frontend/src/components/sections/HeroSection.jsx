import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-20 right-10 sm:top-40 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 sm:bottom-20 sm:left-40 w-48 h-48 sm:w-72 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        <div className="inline-block mb-4 sm:mb-6 px-4 sm:px-6 py-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-full border border-white border-opacity-20">
          <span className="text-white text-xs sm:text-sm font-semibold">🎉 Join 10,000+ Active Learners</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 leading-tight tracking-tight">
          <span className="text-white block sm:inline">Learn Skills. </span>
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent block sm:inline">Teach Skills. </span>
          <span className="text-white block sm:inline">Grow Together.</span>
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
          The world's first skill-exchange platform where knowledge meets opportunity. 
          <span className="text-yellow-300 font-semibold block sm:inline"> Earn credits teaching</span><span className="hidden sm:inline">,</span> 
          <span className="text-pink-300 font-semibold block sm:inline"> spend them learning</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0">
          <Link to="/dashboard" className="w-full sm:w-auto group relative px-8 sm:px-10 py-4 sm:py-5 bg-white text-purple-900 rounded-full text-lg sm:text-xl font-bold overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl">
            <span className="relative z-10">Start Free Today</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <Link to="/skills" className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-transparent border-2 border-white text-white rounded-full text-lg sm:text-xl font-bold hover:bg-white hover:text-purple-900 transition-all duration-300">
            <span className="sm:hidden">Explore Skills</span>
            <span className="hidden sm:inline">Explore Skills →</span>
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-white px-4 sm:px-0">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span className="text-sm sm:text-base">50 Free Credits</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span className="text-sm sm:text-base">No Credit Card</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span className="text-sm sm:text-base">Cancel Anytime</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
