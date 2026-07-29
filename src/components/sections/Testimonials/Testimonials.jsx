import React, { useEffect, useRef, useState } from "react";
import "./Testimonials.css";

function Testimonials() {
  const widgetRef = useRef(null);
  const observerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Elfsight script
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    script.onload = () => setIsLoading(false);
    document.body.appendChild(script);

    const observer = observerRef.current;

    // Clean up
    return () => {
      const elfsightScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
      if (elfsightScript) {
        elfsightScript.remove();
      }
      // Disconnect any observers
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // Suppress ResizeObserver errors for this component only
  useEffect(() => {
    const handleError = (e) => {
      if (e.message && e.message.includes('ResizeObserver loop completed with undelivered notifications')) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
    };

    // Catch errors at the window level
    window.addEventListener('error', handleError);

    // Also catch unhandled rejections
    const handleRejection = (e) => {
      if (e.reason?.message?.includes?.('ResizeObserver')) {
        e.preventDefault();
        return false;
      }
    };
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <span className="testimonials-badge">Community voices</span>
          <h2 className="testimonials-title">
            What our <span className="testimonials-highlight">community says</span>
          </h2>
          <p className="testimonials-description">
            Hear from students and vendors who use MoiHub every day.
          </p>
        </div>

        <div className="testimonials-frame">
          {isLoading && (
            <div className="testimonials-skeleton" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div className="skeleton-card" key={i} style={{ "--i": i }}>
                  <div className="skeleton-stars" />
                  <div className="skeleton-line skeleton-line-lg" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line skeleton-line-sm" />
                  <div className="skeleton-author" />
                </div>
              ))}
              <span className="testimonials-loading-tag">Loading reviews…</span>
            </div>
          )}
          <div className="testimonials-widget" ref={widgetRef}>
            <div
              className="elfsight-app-4d296b6f-f83b-4d6c-999c-7926889e3ec7"
              data-elfsight-app-lazy
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;