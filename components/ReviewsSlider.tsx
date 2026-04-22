'use client';

import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useMemo, useState } from 'react';

type ReviewItem = {
  author?: string;
  rating?: number | string;
  text?: string;
};

type SliderTheme = 'template1' | 'template2' | 'template3';

type ThemeClasses = {
  card: string;
  starActive: string;
  starInactive: string;
  quote: string;
  divider: string;
  badge: string;
  author: string;
  navButton: string;
  navButtonDisabled: string;
  navDot: string;
  navDotActive: string;
};

const THEME_CLASSES: Record<SliderTheme, ThemeClasses> = {
  template1: {
    card: 'bg-white p-10 rounded-4xl border border-[#E5E5E5] flex flex-col h-full hover:shadow-xl hover:border-[#0A0A0A] transition-all duration-300',
    starActive: 'fill-[#C1FF72] text-[#0A0A0A]',
    starInactive: 'fill-[#FCFAF6] text-[#E5E5E5]',
    quote: 'text-[#0A0A0A] leading-relaxed mb-10 text-[16px] grow font-bold text-lg',
    divider: 'border-[#E5E5E5]',
    badge: 'w-10 h-10 bg-[#FCFAF6] border border-[#E5E5E5] rounded-full flex items-center justify-center text-[#0A0A0A] font-extrabold text-sm',
    author: 'font-bold text-sm text-[#0A0A0A] uppercase tracking-wider',
    navButton: 'border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white',
    navButtonDisabled: 'border border-[#E5E5E5] text-gray-300 cursor-not-allowed',
    navDot: 'bg-[#E5E5E5]',
    navDotActive: 'bg-[#0A0A0A]',
  },
  template2: {
    card: 'bg-white p-10 rounded-3xl border border-gray-100 flex flex-col h-full hover:shadow-lg hover:border-gray-300 transition-all duration-300',
    starActive: 'fill-gray-800 text-gray-800',
    starInactive: 'fill-gray-200 text-gray-200',
    quote: 'text-gray-600 leading-relaxed mb-10 text-[16px] grow font-light',
    divider: 'border-gray-100',
    badge: 'w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-blue-900 font-semibold text-sm',
    author: 'font-semibold text-sm text-blue-900 uppercase tracking-wider',
    navButton: 'border border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white',
    navButtonDisabled: 'border border-gray-200 text-gray-300 cursor-not-allowed',
    navDot: 'bg-gray-200',
    navDotActive: 'bg-blue-900',
  },
  template3: {
    card: 'bg-white p-10 rounded-3xl border border-gray-100 flex flex-col h-full hover:shadow-lg hover:border-gray-300 transition-all duration-300',
    starActive: 'fill-gray-800 text-gray-800',
    starInactive: 'fill-gray-200 text-gray-200',
    quote: 'text-gray-600 leading-relaxed mb-10 text-[16px] grow font-light',
    divider: 'border-gray-100',
    badge: 'w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#0084FF] font-semibold text-sm',
    author: 'font-semibold text-sm text-[#0084FF] uppercase tracking-wider',
    navButton: 'border border-[#0084FF] text-[#0084FF] hover:bg-[#0084FF] hover:text-white',
    navButtonDisabled: 'border border-gray-200 text-gray-300 cursor-not-allowed',
    navDot: 'bg-gray-200',
    navDotActive: 'bg-[#0084FF]',
  },
};

function normalizeRating(value: number | string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(5, Math.round(parsed)));
}

export default function ReviewsSlider({ reviews, theme }: { reviews: ReviewItem[]; theme: SliderTheme }) {
  const filteredReviews = useMemo(
    () => reviews.filter((review) => typeof review?.text === 'string' && review.text.trim().length > 0),
    [reviews],
  );

  const cardsPerSlide = 3;
  const totalSlides = Math.max(1, Math.ceil(filteredReviews.length / cardsPerSlide));
  const [currentSlide, setCurrentSlide] = useState(0);
  const classes = THEME_CLASSES[theme];

  const visibleReviews = filteredReviews.slice(
    currentSlide * cardsPerSlide,
    currentSlide * cardsPerSlide + cardsPerSlide,
  );

  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-8">
        {visibleReviews.map((review, index) => {
          const rating = normalizeRating(review.rating);
          return (
            <div key={`${currentSlide}-${index}-${review.author || 'patient'}`} className={classes.card}>
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={`w-4 h-4 ${starIndex < rating ? classes.starActive : classes.starInactive}`}
                  />
                ))}
              </div>
              <p className={classes.quote}>"{review.text}"</p>
              <div className={`flex items-center gap-4 mt-auto border-t pt-6 ${classes.divider}`}>
                <div className={classes.badge}>{review.author ? review.author.charAt(0) : 'U'}</div>
                <div>
                  <h6 className={classes.author}>{review.author || 'Patient'}</h6>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => canGoPrev && setCurrentSlide((value) => value - 1)}
            disabled={!canGoPrev}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              canGoPrev ? classes.navButton : classes.navButtonDisabled
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                aria-label={`Go to slide ${dotIndex + 1}`}
                onClick={() => setCurrentSlide(dotIndex)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  dotIndex === currentSlide ? classes.navDotActive : classes.navDot
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => canGoNext && setCurrentSlide((value) => value + 1)}
            disabled={!canGoNext}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              canGoNext ? classes.navButton : classes.navButtonDisabled
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
