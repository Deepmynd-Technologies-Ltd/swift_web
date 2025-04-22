import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  const slides = [
    {
      image: require("assets/img/landing_image_1.png"),
      title: "Get Started with SwiftAza",
      subtitle: "Join SwiftAza! Sign up in seconds and dive into a world of financial possibilities. Your journey to financial empowerment starts here!",
    },
    {
      image: require("assets/img/landing_image_2.png"),
      title: "Grow your Finances",
      subtitle: "Grow your money effortlessly. Manage assets, explore investments, and track progress—all in one place. SwiftAza makes wealth-building easy for everyone!",
    },
    {
      image: require("assets/img/landing_image_3.png"),
      title: "Connect Globally",
      subtitle: "Swap currencies seamlessly with SwiftAza. Explore global investments and connect with opportunities worldwide. Your finances, borderless and in your hands!",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false); // Fade-out effect
  const [isFadingIn, setIsFadingIn] = useState(false);  // Fade-in effect

  const nextSlide = () => {
    setIsFadingOut(true); // Start fade-out
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      setIsFadingOut(false); // End fade-out
      setIsFadingIn(true);  // Start fade-in
      setTimeout(() => {
        setIsFadingIn(false); // End fade-in
      }, 500); // Match fade-in duration
    }, 500); // Match fade-out duration
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex flex-col items-center w-full bg-black p-8">
      <Link
        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-base font-bold p-2 px-0"
        to="/"
        style={{ margin: "15px", color: "white" }}
      >
        Swift<span style={{ color: "#27C499" }}>Aza</span>
      </Link>

      {/* Slide Navigation Buttons */}
      <div className="flex justify-center w-full mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`mx-3 rounded-my ${currentSlide === index ? "bg-green-500" : "bg-primary-color"}`}
            style={{ width: "120px", height: "2px", padding: "2px" }}
          ></button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="mt-1"
        style={{
          width: "300px",
          height: "100%",
          minHeight: "380px",
          transition: "opacity 0.9s linear", // Smooth fading
          opacity: isFadingOut ? 0 : isFadingIn ? 0.9 : 1, // Transition for fade-out and fade-in
        }}
      >
        <img
          src={slides[currentSlide].image}
          alt="SwiftAza"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h1
        className="mt-6 text-center font-bold"
        style={{
          width: "288px",
          height: "29px",
          color: "#27C499",
          transition: "opacity 0.9s linear",
          opacity: isFadingOut ? 0 : isFadingIn ? 0.9 : 1,
        }}
      >
        {slides[currentSlide].title}
      </h1>

      {/* Subtitle */}
      <p
        className="mt-4 text-sm text-center px-4"
        style={{
          width: "480px",
          height: "72px",
          transition: "opacity 0.9s linear",
          opacity: isFadingOut ? 0 : isFadingIn ? 0.9 : 1,
        }}
      >
        {slides[currentSlide].subtitle}
      </p>
    </div>
  );
}
