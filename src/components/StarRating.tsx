import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

export const StarRating = ({ rating, reviewCount }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.floor(rating)
                ? "fill-foreground text-foreground"
                : star <= rating
                ? "fill-foreground/50 text-foreground"
                : "text-border"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({reviewCount})</span>
    </div>
  );
};
