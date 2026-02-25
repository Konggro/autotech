import { Link } from 'react-router';
import { HeroSlider } from '../components/HeroSlider';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { useProducts } from '../lib/use-products';

export function HomePage() {
  const { products } = useProducts();
  const landingProducts = products.slice(0, 8);

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Featured Products Section */}
      <section className="bg-[#FAFAFA] py-10 md:py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="mb-6 text-center md:mb-8 lg:mb-12">
            <h2 className="mb-2 text-2xl font-bold text-black md:mb-4 lg:text-[36px]">
              Бүтээгдэхүүнүүд
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {landingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:mt-10 lg:mt-12">
            <Button
              asChild
              size="lg"
              className="bg-[#DC2626] px-8 text-sm font-bold hover:bg-[#B91C1C] md:px-12 md:text-base"
            >
              <Link to="/products">Бүх бүтээгдэхүүн үзэх</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-black py-10 md:py-14 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center md:px-8">
          <h2 className="mb-3 text-xl font-bold text-white md:mb-4 md:text-2xl lg:text-[32px]">
            Хайж буй зүйлээ олохгүй байна уу?
          </h2>
          <p className="mb-6 text-sm text-[#E5E7EB] md:mb-8 md:text-base">
            Манай багтай холбогдож зөвлөгөө аваарай
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#DC2626] px-8 text-sm font-bold hover:bg-[#EF4444] md:px-10 md:text-base"
          >
            <Link to="/contact">Одоо холбогдох</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}