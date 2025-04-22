import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
// views
import Dashboard from "views/admin/Dashboard.js";
import History from "views/admin/History.js";
import Browser from "views/admin/Browser.js";

export default function Admin() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [slideDirection, setSlideDirection] = useState("right");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevViewRef = useRef(activeView);
  
  // Swipe handling
  const touchStartXRef = useRef(null);
  const containerRef = useRef(null);
  const minSwipeDistance = 50; // Minimum distance for a swipe to register

  // Define view order for determining slide direction
  const viewOrder = ["dashboard", "history", "browser"];

  // Extract view from path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) {
      changeView("dashboard");
    } else if (path.includes("/admin/history")) {
      changeView("history");
    } else if (path.includes("/admin/browser")) {
      changeView("browser");
    }
  }, [location]);

  const changeView = (newView) => {
    if (newView === activeView || isTransitioning) return;
    
    // Determine slide direction based on view order
    const prevIndex = viewOrder.indexOf(prevViewRef.current);
    const nextIndex = viewOrder.indexOf(newView);
    
    setSlideDirection(nextIndex > prevIndex ? "left" : "right");
    setIsTransitioning(true);
    
    // Store the current view before changing
    prevViewRef.current = activeView;
    
    // Change the view after a small delay to allow CSS transition to start
    setTimeout(() => {
      setActiveView(newView);
      
      // Reset transitioning state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 700); // Match your transition duration
    }, 50);
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  // Handle touch end
  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchEndX - touchStartXRef.current;
    
    // Only process if swipe is long enough
    if (Math.abs(distance) >= minSwipeDistance) {
      const currentIndex = viewOrder.indexOf(activeView);
      
      if (distance > 0) {
        // Swiped right -> go to previous view
        if (currentIndex > 0) {
          changeView(viewOrder[currentIndex - 1]);
        }
      } else {
        // Swiped left -> go to next view
        if (currentIndex < viewOrder.length - 1) {
          changeView(viewOrder[currentIndex + 1]);
        }
      }
    }
    
    touchStartXRef.current = null;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Add CSS for transitions */}
      <style>
        {`
          .view-container {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 100%;
            flex-grow: 1;
            touch-action: pan-y; /* Allow vertical scrolling but capture horizontal swipes */
          }

          .view-content {
            position: absolute;
            width: 100%;
            height: 100%;
            transition: transform 700ms ease;
            overflow-y: auto; /* Allow content to scroll vertically */
          }

          /* Active view */
          .view-content.active {
            transform: translateX(0);
            z-index: 2;
          }

          /* Upcoming view (waiting to enter) */
          .view-content.next-left {
            transform: translateX(100%);
            z-index: 1;
          }
          .view-content.next-right {
            transform: translateX(-100%);
            z-index: 1;
          }

          /* Exiting view */
          .view-content.prev-left {
            transform: translateX(-100%);
            z-index: 1;
          }
          .view-content.prev-right {
            transform: translateX(100%);
            z-index: 1;
          }

          /* For mobile adaptations */
          @media (max-width: 768px) {
            .view-container {
              height: calc(100vh - 64px); /* Adjust based on your bottom nav height */
            }
          }
          
          /* Visual indicator for swipe */
          .swipe-indicator {
            position: fixed;
            top: 50%;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 10;
            pointer-events: none;
          }
          
          .swipe-indicator.left {
            left: 10px;
          }
          
          .swipe-indicator.right {
            right: 10px;
          }
          
          .swipe-indicator.active {
            opacity: 0.7;
          }
        `}
      </style>

      <Sidebar onNavigate={changeView} />
      <div className="relative md:ml-64 bg-primary-color flex flex-col" style={{ marginBottom: "-30px", height: "100vh" }}>
        {/* Background overlay */}
        {isModalOpen && (
          <>
            <div
              className="fixed inset-0 opacity-50 z-40 bg-black"
              onClick={closeModal}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            ></div>
          </>
        )}
        
        
        {/* Container for all views with touch events */}
        <div 
          className="view-container"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Dashboard View */}
          <div 
            className={`view-content ${
              activeView === "dashboard" 
                ? "active" 
                : prevViewRef.current === "dashboard" 
                  ? `prev-${slideDirection}` 
                  : `next-${slideDirection}`
            }`}
          >
            <AdminNavbar />
            <Dashboard />
          </div>
          
          {/* History View */}
          <div 
            className={`view-content ${
              activeView === "history" 
                ? "active" 
                : prevViewRef.current === "history" 
                  ? `prev-${slideDirection}` 
                  : `next-${slideDirection}`
            }`}
          >
            <History />
          </div>
          
          {/* Browser View */}
          <div 
            className={`view-content ${
              activeView === "browser" 
                ? "active" 
                : prevViewRef.current === "browser" 
                  ? `prev-${slideDirection}` 
                  : `next-${slideDirection}`
            }`}
          >
            <Browser />
          </div>
        </div>
      </div>
    </>
  );
}