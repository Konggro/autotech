import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../lib/auth-context';
import type { Product } from '../lib/mock-data';
import { fetchProductById } from '../lib/data-service';
import { useProducts } from '../lib/use-products';
import {
  ChevronRight, Phone, Heart, Share2
} from 'lucide-react';

export function ProductDetailPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { products } = useProducts();
  const { user, favorites, toggleFavorite } = useAuth();

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      if (!id) {
        if (mounted) setLoading(false);
        return;
      }

      const data = await fetchProductById(id);
      if (!mounted) return;
      setProduct(data);
      setLoading(false);
    };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[#6B7280]">Уншиж байна...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-[32px] font-bold">Бүтээгдэхүүн олдсонгүй</h2>
          <Button asChild className="bg-[#DC2626] hover:bg-[#B91C1C]">
            <Link to="/products">Бүтээгдэхүүн үзэх</Link>
          </Button>
        </div>
      </div>
    );
  }

  const stockBadgeColors = {
    'in-stock': 'bg-[#10B981] text-white',
    'limited': 'bg-[#F59E0B] text-white',
    'out-of-stock': 'bg-[#6B7280] text-white'
  };

  const stockLabels = {
    'in-stock': 'Нөөцтэй - Бэлэн байгаа',
    'limited': `Хязгаарлагдмал - ${product.stockCount || 0} ширхэг үлдсэн`,
    'out-of-stock': 'Дууссан - Урьдчилан захиалга'
  };

  const images = [
    product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop'
  ];

  const isFavorited = favorites.includes(product.id);

  const handleFavoriteClick = () => {
    if (!user) {
      alert('Та эхлээд нэвтэрнэ үү');
      return;
    }
    void toggleFavorite(product.id);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-[#E5E7EB] bg-white px-4 py-4 md:px-8 md:py-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-center gap-2 overflow-x-auto text-sm">
            <Link to="/" className="whitespace-nowrap text-[#DC2626] hover:underline">
              Нүүр
            </Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#6B7280]" />
            <Link to="/products" className="whitespace-nowrap text-[#DC2626] hover:underline">
              Бүтээгдэхүүн
            </Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#6B7280]" />
            <span className="truncate text-[#6B7280]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="bg-white py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column - Images */}
            <div>
              <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-md">
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-[400px] w-full object-contain p-8 md:h-[500px] lg:h-[600px]"
                />
              </div>
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[#DC2626] shadow-md'
                        : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name} - Зураг ${index + 1}`}
                      className="h-20 w-20 object-cover md:h-24 md:w-24"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="flex flex-col">
              {/* Brand */}
              <div className="mb-3">
                <span className="inline-block rounded-md bg-[#F3F4F6] px-3 py-1 text-sm font-semibold uppercase tracking-wide text-[#6B7280]">
                  {product.brand}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="mb-4 text-2xl font-bold leading-tight text-black md:text-3xl lg:text-[36px]">
                {product.name}
              </h1>

              {/* Stock Status */}
              <Badge className={`mb-6 w-fit ${stockBadgeColors[product.stock]}`}>
                {stockLabels[product.stock]}
              </Badge>

              {/* Price */}
              <div className="mb-8 rounded-xl bg-[#FEF2F2] p-6">
                {product.salePrice ? (
                  <div>
                    <div className="mb-2 flex flex-wrap items-baseline gap-4">
                      <span className="text-4xl font-bold text-[#DC2626] md:text-5xl">
                        ₮ {product.salePrice.toLocaleString()}
                      </span>
                      <span className="text-xl text-[#6B7280] line-through md:text-2xl">
                        ₮ {product.price.toLocaleString()}
                      </span>
                    </div>
                    <Badge className="bg-[#10B981] text-white">
                      ₮ {(product.price - product.salePrice).toLocaleString()} хэмнэлт
                    </Badge>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-[#DC2626] md:text-5xl">
                    ₮ {product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Specifications */}
              {product.specs && (
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-bold text-black">Техникийн үзүүлэлт</h3>
                  <div className="overflow-hidden rounded-xl border border-[#E5E7EB] shadow-sm">
                    {Object.entries(product.specs).map(([key, value], index) => (
                      <div
                        key={key}
                        className={`grid grid-cols-2 gap-4 p-4 ${
                          index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'
                        }`}
                      >
                        <span className="font-semibold text-[#374151]">
                          {key}:
                        </span>
                        <span className="text-black">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-[#DC2626] py-6 text-base font-bold hover:bg-[#B91C1C] md:py-7"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Үнийн санал авах
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-[#DC2626] py-6 text-base font-bold text-[#DC2626] hover:bg-[#FEF2F2] md:py-7"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Залгах: +976 7777 7777
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleFavoriteClick}
                    variant="outline"
                    className="flex-1 border-2 text-base hover:border-[#DC2626] hover:bg-[#FEF2F2]"
                  >
                    <Heart 
                      className={`mr-2 h-5 w-5 ${isFavorited ? 'fill-[#DC2626] text-[#DC2626]' : ''}`}
                    />
                    {isFavorited ? 'Хадгалсан' : 'Хадгалах'}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 hover:border-[#DC2626] hover:bg-[#FEF2F2]"
                    size="icon"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-[#FAFAFA] py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-4 md:px-8">
            <h2 className="mb-8 text-2xl font-bold text-black md:mb-12 md:text-3xl lg:text-[32px]">
              Танд санал болгох
            </h2>
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
