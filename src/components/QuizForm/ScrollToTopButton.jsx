import { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true); // New state to track if user is at the top

  // Function to check if the page is scrollable
  const checkScrollability = () => {
    const isContentScrollable =
      document.documentElement.scrollHeight > window.innerHeight;
    setIsScrollable(isContentScrollable);
  };

  // Function to check if the user is at the top of the page
  const checkScrollPosition = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    setIsAtTop(scrollTop === 0); // True if at the top
  };

  // Effect to check scrollability and position on mount, resize, and scroll
  useEffect(() => {
    checkScrollability(); // Initial check for scrollability
    checkScrollPosition(); // Initial check for position

    const handleResizeAndScroll = () => {
      checkScrollability();
      checkScrollPosition();
    };

    window.addEventListener("resize", handleResizeAndScroll);
    window.addEventListener("scroll", handleResizeAndScroll);

    return () => {
      window.removeEventListener("resize", handleResizeAndScroll);
      window.removeEventListener("scroll", handleResizeAndScroll);
    };
  }, []);

  const handleScroll = () => {
    if (isAtTop) {
      // Scroll to bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!isScrollable) return null; // Don’t render if not scrollable

  return (
    <button
      onClick={handleScroll}
      className="bg-primary text-text-inverse hover:bg-primary/85 focus:ring-primary/20 active:bg-primary/95 fixed right-2 bottom-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md shadow-md focus:ring-2 focus:outline-none lg:right-[calc(50%-450px)] lg:bottom-20"
      title={isAtTop ? "Przewiń na dół strony" : "Przewiń do góry strony"}
    >
      {isAtTop ? <FaArrowDown size={18} /> : <FaArrowUp size={18} />}
    </button>
  );
};

export default ScrollToTopButton;
