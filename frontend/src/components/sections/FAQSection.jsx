import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    {
      question: 'How does the credit system work?',
      answer: 'You earn 10 credits for every hour you teach and spend 10 credits for every hour you learn. New users receive 50 free credits to get started. Credits never expire and can be used anytime!'
    },
    {
      question: 'Is SkillSwap really free to join?',
      answer: 'Yes! Creating an account is 100% free with no hidden charges. You get 50 free credits on signup. No credit card required. You only use credits for learning sessions, which you can earn by teaching.'
    },
    {
      question: 'How do I become a teacher?',
      answer: 'Simply create a skill listing with your expertise, set your availability, and start receiving swap requests! We verify all teachers to ensure quality. You can teach multiple skills and set your own schedule.'
    },
    {
      question: 'What if I run out of credits?',
      answer: 'You can always earn more credits by teaching! Share your knowledge and help others while building your credit balance. The more you teach, the more you can learn. It\'s a fair exchange system.'
    },
    {
      question: 'Can I get certificates for completed sessions?',
      answer: 'Yes! After completing sessions, you earn verified certificates that showcase your newly acquired skills. These certificates are recognized and can be shared on LinkedIn and other professional platforms.'
    },
    {
      question: 'How are teachers verified?',
      answer: 'All teachers go through our verification process including identity verification, skill assessment, and background checks. We also have a rating system where learners review teachers after each session.'
    },
  
  ];

  return (
    <section className="pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about SkillSwap
          </p>
        </div>
        
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 w-6 h-6 text-blue-600">
                  {openIndex === idx ? <Minus size={24} /> : <Plus size={24} />}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-5 pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-blue-100 mb-6">Our support team is here to help 24/7</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors">
              View Help Center
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
