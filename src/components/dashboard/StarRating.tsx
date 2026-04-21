import { Star, StarHalf } from "lucide-react"

interface StarRatingProps {
  rating: string
}

export const StarRating = ({ rating }: StarRatingProps) => {
  const score = parseFloat(rating) || 0
  const fullStars = Math.floor(score)
  const hasHalfStar = score % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="w-3.5 h-3.5 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-muted-foreground/30" />
      ))}
      <span className="ml-1.5 font-bold text-foreground text-sm">{rating || "0"}</span>
    </div>
  )
}
