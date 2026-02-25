import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import { Product } from '../lib/mock-data';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../lib/auth-context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user, toggleFavorite, isFavorite } = useAuth();
  const isFaved = isFavorite(product.id);

  const stockBadgeColors = {
    'in-stock': 'bg-[#10B981] text-white',
    'limited': 'bg-[#F59E0B] text-white',
    'out-of-stock': 'bg-[#6B7280] text-white'
  };

  const stockLabels = {
    'in-stock': 'Нөөцтэй',
    'limited': 'Хязгаарлагдмал',
    'out-of-stock': 'Дууссан'
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative block rounded-lg bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:border-b-[3px] hover:border-b-[#DC2626] md:p-5"
    >
      {/* Badges */}
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 md:right-3 md:top-3 md:gap-2">
        {product.new && (
          <Badge className="bg-[#DC2626] text-[10px] text-white md:text-xs">ШИНЭ</Badge>
        )}
        {product.salePrice && (
          <Badge className="bg-[#DC2626] text-[10px] text-white md:text-xs">ХЯМДРАЛ</Badge>
        )}
      </div>

      {/* Wishlist Button */}
      {user && user.role === 'user' && (
        <button
          className={`absolute left-2 top-2 z-10 rounded-full bg-white p-1.5 shadow-sm transition-colors md:left-3 md:top-3 md:p-2 ${
            isFaved 
              ? 'text-[#DC2626] hover:text-[#B91C1C]' 
              : 'text-black hover:text-[#DC2626]'
          }`}
          onClick={(e) => {
            e.preventDefault();
            void toggleFavorite(product.id);
          }}
        >
          <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isFaved ? 'fill-current' : ''}`} />
        </button>
      )}

      {/* Product Image */}
      <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white md:mb-4">
        <ImageWithFallback
          src={product.image || `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop`}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Category/Brand */}
      <div className="mb-1 text-[10px] uppercase tracking-wide text-[#6B7280] md:mb-2 md:text-xs">
        {product.brand}
      </div>

      {/* Product Name */}
      <h3 className="mb-2 line-clamp-2 min-h-[2.4rem] text-sm font-semibold text-black md:mb-3 md:min-h-[2.8rem] md:text-base">
        {product.name}
      </h3>

      {/* Quick Specs */}
      {product.specs && (
        <div className="mb-2 text-xs text-[#6B7280] md:mb-3 md:text-sm">
          {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
            <span key={key}>{value} </span>
          ))}
        </div>
      )}

      {/* Price */}
      <div className="mb-2 md:mb-3">
        {product.salePrice ? (
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-lg font-bold text-[#DC2626] md:text-[24px]">
              ₮ {product.salePrice.toLocaleString()}
            </span>
            <span className="text-xs text-[#6B7280] line-through md:text-sm">
              ₮ {product.price.toLocaleString()}
            </span>
          </div>
        ) : (
          <span className="text-lg font-bold text-[#DC2626] md:text-[24px]">
            ₮ {product.price.toLocaleString()}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <Badge className={`mb-2 text-[10px] md:mb-3 md:text-xs ${stockBadgeColors[product.stock]}`}>
        {stockLabels[product.stock]}
      </Badge>

      {/* View Details */}
      <div className="text-sm font-semibold text-[#DC2626] group-hover:underline md:text-base">
        Дэлгэрэнгүй
      </div>
    </Link>
  );
}