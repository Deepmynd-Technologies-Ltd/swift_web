import React, { useState } from 'react';
import { Star } from 'lucide-react';
import "../assets/styles/testimonials.css";

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      rating: 5,
      quote: "SwiftAza has completely transformed my trading experience. The platform is lightning fast, and the analytics tools give me an edge in the market I never had before.",
      name: "Alex Johnson",
      title: "Day Trader, Independent",
      profileImage: require("../assets/img/alex_johnson.png")
    },
    {
      rating: 5,
      quote: "As someone who manages large portfolios, security and reliability are non-negotiable. SwiftAza delivers on both fronts, with the added benefit of institutional-grade tools.",
      name: "Sarah Williams",
      title: "Investment Manager, Global Investments",
      profileImage: require("../assets/img/alex_johnson.png")
    },
    {
      rating: 4,
      quote: "I've used many crypto platforms, but none match SwiftAza's user experience. The multi-currency wallet makes managing my diverse portfolio simple and efficient.",
      name: "Michael Chen",
      title: "Crypto Enthusiast, Tech Innovations",
      profileImage: require("../assets/img/alex_johnson.png")
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Handle touch events for swipe functionality
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null); // reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextTestimonial();
    }
    if (isRightSwipe) {
      prevTestimonial();
    }
  };

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <div className="section-tag">Testimonials</div>
        <h2 className="testimonial-heading">What our Clients say about us.</h2>
        
        <div 
          className="testimonial-card"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <p className="testimonial-text">
            "{testimonials[currentTestimonial].quote}"
          </p>

          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`star-icon ${i < testimonials[currentTestimonial].rating ? 'filled' : ''}`}
                size={20}
              />
            ))}
          </div>
          
          <div className="testimonial-author">
            <div className="divider-line"></div>
            <div className="author-info">
              <img 
                className="author-image" 
                src={testimonials[currentTestimonial].profileImage} 
                alt={`${testimonials[currentTestimonial].name} profile`} 
              />
              <div className="author-details">
                <p className="author-name">{testimonials[currentTestimonial].name}</p>
                <p className="author-title">{testimonials[currentTestimonial].title}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="testimonial-nav">
          <button 
            onClick={prevTestimonial} 
            className="nav-button" 
            aria-label="Previous testimonial"
          >
            ＜
          </button>
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          <button 
            onClick={nextTestimonial} 
            className="nav-button" 
            aria-label="Next testimonial"
          >
            ＞
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;