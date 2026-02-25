import { useAuth } from '../lib/auth-context';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { useProducts } from '../lib/use-products';

export function FavoritesPage() {
  const { favorites, user } = useAuth();
  const { products } = useProducts();

  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id)
  );

  if (!user || user.role !== 'user') {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black md:text-3xl">
            Дуртай бүтээгдэхүүн
          </h1>
          <p className="mt-4 text-[#6B7280]">
            Дуртай бүтээгдэхүүнээ харахын тулд эхлээд нэвтэрнэ үү.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black md:text-3xl">
          Дуртай бүтээгдэхүүн
        </h1>
        <p className="mt-2 text-[#6B7280]">
          {favoriteProducts.length} бүтээгдэхүүн
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3F4F6]">
            <Heart className="h-8 w-8 text-[#6B7280]" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-black">
            Дуртай бүтээгдэхүүн байхгүй
          </h2>
          <p className="text-[#6B7280]">
            Та бүтээгдэхүүн хайж, дуртай бүтээгдэхүүнээ хадгална уу.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
