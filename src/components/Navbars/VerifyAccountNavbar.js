/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  return (
    <div className="flex flex-col items-center w-full bg-black p-4">
      {/* Top Text */}
        <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-base font-bold p-2 px-0"
            to="/"
            style={{ margin: "15px" }}
            >
            Swift<span style={{color: "#27C499"}}>Aza</span>
        </Link>
      

        {/* Main Image */}
        <div 
          className="mt-1"
          style={{ width: '300px', height: '100%' }}
        >
          <img 
            src={require("assets/img/landing_image_2.png")}
            alt="SwiftAza"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
      <h1 
        className="mt-6 text-center font-bold"
        style={{ width: '288px', height: '29px', color: '#27C499' }}
      >
        Get Started with SwiftAza
      </h1>

      {/* Subtitle */}
      <p 
        className="mt-4 text-sm text-center px-4"
        style={{ width: '480px', height: '72px' }}
      >
        Join SwiftAza! Sign up in seconds and dive into a world of financial possibilities. 
        Your journey to financial empowerment starts here!
      </p>
    </div>
  );
}