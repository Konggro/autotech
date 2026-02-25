import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { categories } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { 
  ChevronRight, SlidersHorizontal, Grid3x3, 
  List
} from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import { useProducts } from '../lib/use-products';

export function ProductListingPage() {
  const { category } = useParams();
  const { products } = useProducts();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 400000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categoryData = categories.find(c => c.slug === category);
  const categoryName = categoryData?.name || 'All Products';

  // Filter products
  let filteredProducts = category 
    ? products.filter(p => p.category.toLowerCase().includes(category.replace('-', ' ')))
    : products;

  // Apply filters
  if (selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      selectedBrands.includes(p.brand)
    );
  }

  if (stockFilter.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      stockFilter.includes(p.stock)
    );
  }

  filteredProducts = filteredProducts.filter(p => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-[#E5E7EB] bg-white px-4 py-4 md:px-8 md:py-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-2 flex items-center gap-2 text-xs md:mb-4 md:text-sm">
            <Link to="/" className="text-[#DC2626] hover:underline">
              Нүүр
            </Link>
            <ChevronRight className="h-3 w-3 text-[#6B7280] md:h-4 md:w-4" />
            <Link to="/products" className="text-[#DC2626] hover:underline">
              Бүтээгдэхүүн
            </Link>
            {category && (
              <>
                <ChevronRight className="h-3 w-3 text-[#6B7280] md:h-4 md:w-4" />
                <span className="text-[#DC2626]">{categoryName}</span>
              </>
            )}
          </div>
          <h1 className="text-xl font-bold text-black md:text-2xl lg:text-[32px]">{categoryName}</h1>
          <p className="mt-1 text-xs text-[#6B7280] md:mt-2 md:text-sm">
            {sortedProducts.length} бүтээгдэхүүн
          </p>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="sticky top-16 z-40 border-b border-[#E5E7EB] bg-white px-4 py-3 md:top-20 md:px-8 md:py-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2">
          {/* Mobile Filter Button */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Шүүлтүүр
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-[320px] overflow-y-auto p-0">
              <SheetHeader className="border-b border-[#E5E7EB] px-6 py-4">
                <SheetTitle className="text-lg font-bold text-black">Шүүлтүүр</SheetTitle>
                <SheetDescription className="text-sm text-[#6B7280]">
                  Бүтээгдэхүүнийг үнэ, брэнд болон нөөцийн байдлаар шүүнэ үү
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 py-6 space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="mb-4 text-sm font-bold text-black">Үнийн хязгаар</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={400000000}
                    step={10000}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm text-[#6B7280]">
                    <span>₮ {priceRange[0].toLocaleString()}</span>
                    <span>₮ {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h3 className="mb-4 text-sm font-bold text-black">Брэнд</h3>
                  <div className="space-y-3">
                    {uniqueBrands.slice(0, 8).map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(
                                selectedBrands.filter(b => b !== brand)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`mobile-${brand}`}
                          className="cursor-pointer text-sm"
                        >
                          {brand} ({products.filter(p => p.brand === brand).length})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Status */}
                <div>
                  <h3 className="mb-4 text-sm font-bold text-black">Нөөцийн байдал</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mobile-in-stock"
                        checked={stockFilter.includes('in-stock')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStockFilter([...stockFilter, 'in-stock']);
                          } else {
                            setStockFilter(stockFilter.filter(s => s !== 'in-stock'));
                          }
                        }}
                      />
                      <Label htmlFor="mobile-in-stock" className="cursor-pointer text-sm">
                        Нөөцтэй
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mobile-limited"
                        checked={stockFilter.includes('limited')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStockFilter([...stockFilter, 'limited']);
                          } else {
                            setStockFilter(stockFilter.filter(s => s !== 'limited'));
                          }
                        }}
                      />
                      <Label htmlFor="mobile-limited" className="cursor-pointer text-sm">
                        Хязгаарлагдмал
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Buttons */}
              <div className="sticky bottom-0 border-t border-[#E5E7EB] bg-white px-6 py-4 space-y-2">
                <Button 
                  className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Хайх
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedBrands([]);
                    setStockFilter([]);
                    setPriceRange([0, 400000000]);
                  }}
                >
                  Цэвэрлэх
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px] text-xs md:w-[200px] md:text-sm">
                <SelectValue placeholder="Эрэмбэлэх" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Шинэ эхэнд</SelectItem>
                <SelectItem value="price-low">Үнэ: Бага → Их</SelectItem>
                <SelectItem value="price-high">Үнэ: Их → Бага</SelectItem>
                <SelectItem value="name">Нэр А-Я</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden gap-2 sm:flex">
              <Button
                variant={view === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setView('grid')}
                className="h-9 w-9"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setView('list')}
                className="h-9 w-9"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-8 md:py-8">
          <div className="flex gap-6 lg:gap-8">
            {/* Desktop Sidebar - Filters */}
            <aside className="hidden w-[280px] flex-shrink-0 lg:block">
              <div className="sticky top-32 space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="mb-4 font-bold text-black">Үнийн хязгаар</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={400000000}
                    step={10000}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm text-[#6B7280]">
                    <span>₮ {priceRange[0].toLocaleString()}</span>
                    <span>₮ {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h3 className="mb-4 font-bold text-black">Брэнд</h3>
                  <div className="space-y-3">
                    {uniqueBrands.slice(0, 8).map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(
                                selectedBrands.filter(b => b !== brand)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={brand}
                          className="cursor-pointer text-sm"
                        >
                          {brand} ({products.filter(p => p.brand === brand).length})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Status */}
                <div>
                  <h3 className="mb-4 font-bold text-black">Нөөцийн байдал</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock"
                        checked={stockFilter.includes('in-stock')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStockFilter([...stockFilter, 'in-stock']);
                          } else {
                            setStockFilter(stockFilter.filter(s => s !== 'in-stock'));
                          }
                        }}
                      />
                      <Label htmlFor="in-stock" className="cursor-pointer text-sm">
                        Нөөцтэй
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="limited"
                        checked={stockFilter.includes('limited')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStockFilter([...stockFilter, 'limited']);
                          } else {
                            setStockFilter(stockFilter.filter(s => s !== 'limited'));
                          }
                        }}
                      />
                      <Label htmlFor="limited" className="cursor-pointer text-sm">
                        Хязгаарлагдмал
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedBrands([]);
                    setStockFilter([]);
                    setPriceRange([0, 400000000]);
                  }}
                >
                  Шүүлтүүр цэвэрлэх
                </Button>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className={`grid gap-3 md:gap-6 ${
                view === 'grid' 
                  ? 'grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="py-12 text-center md:py-20">
                  <p className="mb-4 text-sm text-[#6B7280] md:text-base">
                    Шүүлтүүрт тохирох бүтээгдэхүүн олдсонгүй.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedBrands([]);
                      setStockFilter([]);
                      setPriceRange([0, 400000000]);
                    }}
                  >
                    Шүүлтүүр цэвэрлэх
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}