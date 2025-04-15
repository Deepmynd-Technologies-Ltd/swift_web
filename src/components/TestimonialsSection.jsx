import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "./ui/button";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Day Trader",
      company: "Independent",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "SwiftAza has completely transformed my trading experience. The platform is lightning fast, and the analytics tools give me an edge in the market I never had before.",
      rating: 5
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Investment Manager",
      company: "Global Investments",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "As someone who manages large portfolios, security and reliability are non-negotiable. SwiftAza delivers on both fronts, with the added benefit of institutional-grade tools.",
      rating: 5
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Crypto Enthusiast",
      company: "Tech Innovations",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      content: "I've used many crypto platforms, but none match SwiftAza's user experience. The multi-currency wallet makes managing my diverse portfolio simple and efficient.",
      rating: 4
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="section-padding bg-swiftaza-darker relative">
      {/* Background gradient circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-swiftaza-purple/10 rounded-full filter blur-[80px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-swiftaza-blue/10 rounded-full filter blur-[80px] -z-10"></div>

      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say About<br />
            <span className="gradient-text">SwiftAza</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Don't just take our word for it — hear from some of our satisfied traders.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12 rounded-2xl">
            <div className="flex flex-col items-center text-center relative">
              <div className="mb-8">
                {/* Rating stars */}
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-lg md:text-xl italic mb-8">"{testimonial.content}"</p>
                
                <div className="flex flex-col items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full border-2 border-swiftaza-purple mb-3" 
                  />
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-white/70">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button 
              variant="outline" 
              className="rounded-full w-12 h-12 p-0 border-white/20" 
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="rounded-full w-12 h-12 p-0 border-white/20" 
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
