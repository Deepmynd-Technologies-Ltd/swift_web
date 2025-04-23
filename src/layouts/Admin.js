import React, { useState, useEffect, useRef } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
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
  const [previousView, setPreviousView] = useState(null);
  const [transitioningToView, setTransitioningToView] = useState(null);
  const [transitionDirection, setTransitionDirection] = useState(null); // "next" or "prev"
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isMobileRef = useRef(false);
  
  // Swipe handling
  const touchStartXRef = useRef(null);
  const containerRef = useRef(null);
  const minSwipeDistance = 50; // Minimum distance for a swipe to register

  // Define view order for determining slide direction
  const viewOrder = ["dashboard", "history", "browser"];

  // Check if current device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      isMobileRef.current = window.innerWidth <= 768;
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

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
    
    // Determine if this is next or prev navigation
    const currentIndex = viewOrder.indexOf(activeView);
    const newIndex = viewOrder.indexOf(newView);
    const direction = newIndex > currentIndex ? "next" : "prev";
    
    setIsTransitioning(true);
    setPreviousView(activeView);
    setTransitioningToView(newView);
    setTransitionDirection(direction);
    
    // Change the view after a small delay to allow CSS transition to start
    setTimeout(() => {
      setActiveView(newView);
      
      // Reset transitioning state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitioningToView(null);
        setTransitionDirection(null);
      }, 700); // Match your transition duration
    }, 50);
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    if (isMobileRef.current) {
      touchStartXRef.current = e.touches[0].clientX;
    }
  };

  // Handle touch end
  const handleTouchEnd = (e) => {
    if (!isMobileRef.current || touchStartXRef.current === null) return;
    
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

  // Helper function to determine classes and visibility for views
  const getViewClasses = (viewName) => {
    // On desktop, just show/hide without animation
    if (!isMobileRef.current) {
      return `view-content ${activeView === viewName ? "active" : "hidden"}`;
    }
    
    // Determine if this view should be visible during transition
    if (isTransitioning) {
      // If this is the view we're transitioning from
      if (previousView === viewName) {
        return transitionDirection === "next" 
          ? "view-content exit-left"    // When going to next, exit to left
          : "view-content exit-right";  // When going to prev, exit to right
      }
      
      // If this is the view we're transitioning to
      if (transitioningToView === viewName) {
        return transitionDirection === "next" 
          ? "view-content enter-right"  // When going to next, enter from right
          : "view-content enter-left";  // When going to prev, enter from left
      }
      
      // If it's neither the previous nor the next view, hide it
      return "view-content hidden";
    }
    
    // Not transitioning, just show the active view
    return `view-content ${activeView === viewName ? "active" : "hidden"}`;
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

          /* Hidden view (for desktop and non-visible mobile views) */
          .view-content.hidden {
            display: none;
          }

          /* For mobile only */
          @media (max-width: 768px) {
            /* Exit animations */
            .view-content.exit-left {
              transform: translateX(-100%);
              z-index: 1;
            }
            
            .view-content.exit-right {
              transform: translateX(100%);
              z-index: 1;
            }
            
            /* Enter animations */
            .view-content.enter-left {
              transform: translateX(-100%);
              z-index: 1;
            }
            
            .view-content.enter-right {
              transform: translateX(100%);
              z-index: 1;
            }
            
            /* When transitioning, these will animate to/from their positions */
            .view-content.active.exit-left,
            .view-content.active.exit-right,
            .view-content.active.enter-left,
            .view-content.active.enter-right {
              transform: translateX(0);
            }
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
          <div className={getViewClasses("dashboard")}>
            <AdminNavbar />
            <Dashboard />
          </div>
          
          {/* History View */}
          <div className={getViewClasses("history")}>
            <History />
          </div>
          
          {/* Browser View */}
          <div className={getViewClasses("browser")}>
            <Browser />
          </div>
        </div>
      </div>
    </>
  );
}