import React, { useState, useEffect } from "react";
import "./HeroSlider.css";

const HeroSlider = ({
  images,
  title,
  desc,
  baseUrl = "http://localhost:5001/",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle next and previous slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="hero-slider">
      <div className="slider-container">
        {images.length > 1 ? (
          <div className="slides">
            <div
              className="slide"
              style={{
                backgroundImage: `url(${
                  baseUrl + images[currentIndex].replace(/\\/g, "/")
                })`,
                animation: "slideIn 1s ease-out",
              }}
            >
              <div className="slide-text">
                <h1>{title}</h1>
                <p>{desc}</p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="masterhead"
            style={{
              backgroundImage: `url(${
                baseUrl + images[0].replace(/\\/g, "/")
              })`,
            }}
          >
            <div className="masterhead-text">
              <h1>{title}</h1>
              <p>{desc}</p>
            </div>
          </div>
        )}
        {images.length > 1 && false ? (
          <>
            <button className="prev-btn" onClick={prevSlide}>
              &#10094;
            </button>
            <button className="next-btn" onClick={nextSlide}>
              &#10095;
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default HeroSlider;
