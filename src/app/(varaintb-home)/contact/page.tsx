"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import AppLayoutB from "@/components/global-b/AppLayoutB";

const faqs = [
  {
    question: "Why should I use Rumer?",
    answer: "Rumer provides a comprehensive platform for livestock traceability, marketplace connectivity, and supply chain management. Our tools help farmers, traders, and buyers connect seamlessly while ensuring transparency and security in every transaction.",
  },
  {
    question: "Is Rumer a subscription based platform?",
    answer: "No, Rumer is not subscription-based. Our basic features are free to use. We offer premium features for businesses that need advanced analytics and tools, but you can start selling and buying on the platform without any subscription fees.",
  },
  {
    question: "Is Rumer free?",
    answer: "Yes, Rumer is free for basic usage. Farmers can list their products, buyers can browse and purchase, and traders can manage their inventory without any fees. We only charge small transaction fees on completed sales to maintain the platform.",
  },
];

const testimonials = [
  {
    quote: "Rumer has transformed our operations, making it easier to manage our livestock efficiently.",
    name: "Ben Sani",
    location: "Katsina State, Nigeria",
    company: "Sani Farms",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
  },
  {
    quote: "The traceability features have helped us build trust with our customers. We can now prove the origin and quality of our livestock.",
    name: "Amina Bello",
    location: "Kaduna State, Nigeria",
    company: "Bello Livestock",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
  },
  {
    quote: "As a buyer, I love the transparency. I can see exactly where my products come from and track every step of the process.",
    name: "Chukwuemeka Obi",
    location: "Lagos State, Nigeria",
    company: "Obi Imports",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
  },
];

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          firstName,
          lastName,
          email,
          phone,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send message. Please try again.");
        return;
      }

      setSubmitted(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <AppLayoutB>
    <div className="min-h-screen bg-white">
      {/* Contact Form Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pt-32 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-6">
              Contact Us
              <ChevronRight className="w-4 h-4" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              We&apos;re always available to answer your questions
            </h1>
            
            <p className="text-gray-600 mb-8 max-w-lg">
              Get behind the scenes on our process, exciting news, and the people making dreams come true for millions of businesses.
            </p>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#014834]" />
                <span className="text-sm font-medium text-gray-700">Traceability</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#014834]" />
                <span className="text-sm font-medium text-gray-700">Ecosystem</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#014834]" />
                <span className="text-sm font-medium text-gray-700">Protected and Secured</span>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="eg. John"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#014834]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="eg. Francisco"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#014834]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eg. johnfrancis@gmail.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#014834]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Phone Number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#014834]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">How can we help you?</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter How can we help you?"
                  rows={4}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#014834] resize-none"
                />
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Message sent successfully! We&apos;ll get back to you soon.</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                >
                  <span className="text-sm font-medium text-red-800">{error}</span>
                </motion.div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FFD100] text-black font-bold rounded-lg hover:bg-[#E6BC00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Connect With Us Section */}
      <section className="bg-[#014834] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-green-300 mb-2">Connect with Us</p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                Want to meet the team? Come say hello.
              </h2>
              
              <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 rounded-lg w-fit">
                <span className="text-xl">🇳🇬</span>
                <span className="font-medium">Nigeria</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-300 mt-0.5" />
                  <p className="text-gray-300">Suite 85 Osando Mega Plaza, Gaduwa, Abuja FCT, Nigeria</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-300" />
                  <a href="mailto:info@rumer.com" className="text-gray-300 hover:text-white transition-colors">
                    info@rumer.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-300" />
                  <div className="flex flex-col gap-1">
                    <a href="tel:+2348101252526" className="text-gray-300 hover:text-white transition-colors">
                      +2348101252526
                    </a>
                    <a href="tel:+447554677992" className="text-gray-300 hover:text-white transition-colors">
                      +447554677992
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-8">
                <a href="https://twitter.com/rumer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://facebook.com/rumer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/company/rumer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/rumer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="relative flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Globe graphic */}
                <svg viewBox="0 0 400 400" className="w-full h-full opacity-80">
                  {/* Globe circle */}
                  <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                  <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  
                  {/* Latitude lines */}
                  <ellipse cx="200" cy="200" rx="150" ry="50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  <ellipse cx="200" cy="200" rx="150" ry="100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                  
                  {/* Longitude lines */}
                  <ellipse cx="200" cy="200" rx="50" ry="150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  <ellipse cx="200" cy="200" rx="100" ry="150" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                  
                  {/* Connection nodes */}
                  <circle cx="150" cy="150" r="4" fill="#4ADE80"/>
                  <circle cx="250" cy="120" r="3" fill="#4ADE80"/>
                  <circle cx="280" cy="200" r="5" fill="#4ADE80"/>
                  <circle cx="220" cy="280" r="4" fill="#4ADE80"/>
                  <circle cx="120" cy="250" r="3" fill="#4ADE80"/>
                  <circle cx="180" cy="180" r="6" fill="#22C55E"/>
                  <circle cx="240" cy="220" r="4" fill="#22C55E"/>
                  
                  {/* Connection lines */}
                  <line x1="150" y1="150" x2="180" y2="180" stroke="rgba(74,222,128,0.5)" strokeWidth="1"/>
                  <line x1="180" y1="180" x2="250" y2="120" stroke="rgba(74,222,128,0.5)" strokeWidth="1"/>
                  <line x1="180" y1="180" x2="240" y2="220" stroke="rgba(74,222,128,0.5)" strokeWidth="1"/>
                  <line x1="240" y1="220" x2="280" y2="200" stroke="rgba(74,222,128,0.5)" strokeWidth="1"/>
                  <line x1="240" y1="220" x2="220" y2="280" stroke="rgba(74,222,128,0.5)" strokeWidth="1"/>
                  <line x1="180" y1="180" x2="120" y2="250" stroke="rgba(74,222,128,0.5)" strokeWidth="1"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <img
                src={testimonials[testimonialIndex].image}
                alt={testimonials[testimonialIndex].name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="bg-[#E8F5E9] rounded-2xl p-8 lg:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xl lg:text-2xl font-medium text-gray-900 mb-8 leading-relaxed">
                    &ldquo;{testimonials[testimonialIndex].quote}&rdquo;
                  </p>
                  
                  <div className="mb-8">
                    <p className="font-bold text-gray-900">{testimonials[testimonialIndex].name}</p>
                    <p className="text-gray-600">{testimonials[testimonialIndex].location}</p>
                    <p className="text-gray-500 text-sm">{testimonials[testimonialIndex].company}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#014834] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#014834] transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">FAQ.</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <Minus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access Program Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#014834] rounded-3xl p-8 lg:p-12 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-4">
                  Early Access Program
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Join the Rumer Early Access Program.
                </h2>
                <p className="text-gray-300 mb-6">
                  Be among the first verified producers and buyers shaping the future of traceable livestock trade in Africa.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Priority onboarding</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Direct feedback into product development</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Controlled access and guided onboarding</span>
                  </li>
                </ul>
                
                <button className="flex items-center gap-2 px-6 py-3 bg-[#FFD100] text-black font-bold rounded-lg hover:bg-[#E6BC00] transition-colors">
                  Join the movement today
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  {/* Wallet balance card */}
                  <div className="bg-[#0D3D2F] rounded-xl p-4 mb-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-2xl font-bold">N473,000.00</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">₦</span>
                          </div>
                          <span className="text-gray-400 text-sm">N172,000</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rumer Wallet card */}
                  <div className="bg-[#1A4D3C] rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Rumer Wallet</p>
                    <p className="text-white text-2xl font-bold">N473,838,933.00</p>
                  </div>
                  
                  {/* Decorative dots */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 opacity-30">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {[...Array(25)].map((_, i) => (
                        <circle
                          key={i}
                          cx={(i % 5) * 25 + 10}
                          cy={Math.floor(i / 5) * 25 + 10}
                          r="2"
                          fill="#4ADE80"
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
    </AppLayoutB>
  );
}
