import { useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogPage } from "./CatalogPage";

interface FlipbookPage {
  imageUrl: string;
  productName: string;
  price: string;
  originalPrice?: string;
  category?: string;
  sizes?: string[];
  fitNote?: string;
}

interface FlipbookProps {
  pages: FlipbookPage[];
  theme?: string;
}

// Page turn sound - uses existing ding sound as fallback
const playPageTurnSound = () => {
  const audio = new Audio("/sounds/ding.mp3");
  audio.volume = 0.2;
  audio.playbackRate = 0.8;
  audio.play().catch(() => {});
};

export const Flipbook = ({ pages, theme = "classic" }: FlipbookProps) => {
  const flipBookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handlePageFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
    playPageTurnSound();
  }, []);

  const goToPrevPage = () => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  };

  const goToNextPage = () => {
    flipBookRef.current?.pageFlip()?.flipNext();
  };

  const handlePageHover = (isHovering: boolean) => {
    setIsPaused(isHovering);
  };

  // Add cover and back pages
  const allPages = [
    { 
      imageUrl: pages[0]?.imageUrl || "/placeholder.svg", 
      productName: "Your Personalized Collection",
      price: "",
      category: "CURATED FOR YOU",
      isCover: true
    },
    ...pages,
    { 
      imageUrl: "/placeholder.svg", 
      productName: "Thank You",
      price: "",
      category: "MORE STYLES AWAIT",
      isBackCover: true
    }
  ];

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Page indicator */}
      <div className="flex items-center space-x-4 text-neutral-400">
        <span className="text-sm tracking-widest uppercase font-light">
          Page {currentPage + 1} of {allPages.length}
        </span>
      </div>

      {/* Flipbook container with 3D perspective */}
      <div 
        className="relative"
        style={{ 
          perspective: "2000px",
          perspectiveOrigin: "center center"
        }}
      >
        {/* Soft shadow underneath */}
        <div 
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/40 blur-xl rounded-full"
          style={{ transform: "translateX(-50%) rotateX(80deg)" }}
        />

        {/* @ts-ignore - react-pageflip types issue */}
        <HTMLFlipBook
          ref={flipBookRef}
          width={400}
          height={560}
          size="stretch"
          minWidth={300}
          maxWidth={500}
          minHeight={420}
          maxHeight={700}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={handlePageFlip}
          className="catalog-flipbook"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)"
          }}
          flippingTime={800}
          usePortrait={false}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          drawShadow={true}
          useMouseEvents={!isPaused}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {allPages.map((page, index) => (
            <div key={index} className="page-wrapper">
              <CatalogPage
                {...page}
                pageNumber={index}
                onHover={handlePageHover}
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center space-x-6">
        <Button
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          variant="outline"
          size="lg"
          className="border-neutral-700 bg-neutral-900/50 text-white hover:bg-neutral-800 hover:border-neutral-600 disabled:opacity-30 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {allPages.map((_, index) => (
            <button
              key={index}
              onClick={() => flipBookRef.current?.pageFlip()?.turnToPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentPage === index 
                  ? "bg-white scale-125" 
                  : "bg-neutral-600 hover:bg-neutral-500"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={goToNextPage}
          disabled={currentPage === allPages.length - 1}
          variant="outline"
          size="lg"
          className="border-neutral-700 bg-neutral-900/50 text-white hover:bg-neutral-800 hover:border-neutral-600 disabled:opacity-30 backdrop-blur-sm"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
};
