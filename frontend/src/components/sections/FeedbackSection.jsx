export default function FeedbackSection() {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Software Engineer',
      company: 'Google',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      rating: 5,
      text: 'SkillSwap transformed my career! I learned Python from an amazing mentor and landed my dream job. The credit system is brilliant - I taught design and used those credits to learn coding. Absolutely game-changing!'
    },
    {
      name: 'Marcus Chen',
      role: 'Product Designer',
      company: 'Meta',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      rating: 5,
      text: 'Best investment of my time! The quality of teachers is outstanding. I\'ve learned guitar, Spanish, and photography. The community is incredibly supportive. This platform is the future of education.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      company: 'Amazon',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      rating: 5,
      text: 'I love teaching marketing and earning credits to learn new skills. The platform is intuitive, sessions are flexible, and I\'ve met amazing people. SkillSwap is more than a platform - it\'s a community!'
    },
    {
      name: 'David Park',
      role: 'Data Scientist',
      company: 'Microsoft',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      rating: 5,
      text: 'The AI matching is incredible! It connected me with the perfect mentors for machine learning. I\'ve completed 50+ sessions and earned 3 certificates. Worth every credit!'
    },
    {
      name: 'Lisa Thompson',
      role: 'UX Researcher',
      company: 'Apple',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
      rating: 5,
      text: 'As both a teacher and learner, SkillSwap is perfect. The video quality is excellent, scheduling is seamless, and the badge system keeps me motivated. Highly recommend to everyone!'
    },
    {
      name: 'James Wilson',
      role: 'Entrepreneur',
      company: 'Startup Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      rating: 5,
      text: 'Built my entire skill stack on SkillSwap! From coding to marketing to finance - all through skill exchange. The ROI is infinite. This is how education should work.'
    }
  ];

  return (
    <section className="pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by <span className="text-blue-600">10,000+ Users</span>
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it. Here's what our community has to say.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500">{testimonial.company}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
