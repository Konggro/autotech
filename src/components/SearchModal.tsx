import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';
import { useProducts } from '../lib/use-products';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(products);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setSearchResults(products);
    }
  }, [open, products]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.specs && Object.values(product.specs).some(spec => 
          spec.toLowerCase().includes(query)
        ))
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, products]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] p-0 sm:max-w-[800px]" aria-describedby="search-description">
        <DialogTitle className="sr-only">Бүтээгдэхүүн хайх</DialogTitle>
        <DialogDescription id="search-description" className="sr-only">
          Бүтээгдэхүүний нэр, брэнд, эсвэл ангиллаар хайлт хийх
        </DialogDescription>
        
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] p-4">
          <Search className="h-5 w-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Бүтээгдэхүүн хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-base outline-none placeholder:text-[#6B7280]"
            autoFocus
          />
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto md:max-h-[500px]">
          {searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3F4F6]">
                <Search className="h-8 w-8 text-[#6B7280]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black">
                Илэрц олдсонгүй
              </h3>
              <p className="text-sm text-[#6B7280]">
                "{searchQuery}" гэсэн хайлтад тохирох бүтээгдэхүүн олдсонгүй
              </p>
            </div>
          ) : (
            <div className="p-2">
              {searchQuery && (
                <div className="mb-2 px-2 py-1 text-xs text-[#6B7280]">
                  {searchResults.length} бүтээгдэхүүн олдлоо
                </div>
              )}
              <div className="space-y-1">
                {searchResults.slice(0, 20).map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#F3F4F6] md:gap-4 md:p-3"
                  >
                    {/* Product Image */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white md:h-20 md:w-20">
                      <ImageWithFallback
                        src={product.image || `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop`}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 text-[10px] uppercase tracking-wide text-[#6B7280] md:text-xs">
                        {product.brand}
                      </div>
                      <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-black md:text-base">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {product.salePrice ? (
                          <>
                            <span className="text-sm font-bold text-[#DC2626] md:text-base">
                              ₮ {product.salePrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-[#6B7280] line-through">
                              ₮ {product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-[#DC2626] md:text-base">
                            ₮ {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stock Badge */}
                    <div className="hidden flex-shrink-0 md:block">
                      {product.stock === 'in-stock' && (
                        <span className="inline-block rounded-full bg-[#10B981] px-2 py-1 text-xs text-white">
                          Нөөцтэй
                        </span>
                      )}
                      {product.stock === 'limited' && (
                        <span className="inline-block rounded-full bg-[#F59E0B] px-2 py-1 text-xs text-white">
                          Хязгаарлагдмал
                        </span>
                      )}
                      {product.stock === 'out-of-stock' && (
                        <span className="inline-block rounded-full bg-[#6B7280] px-2 py-1 text-xs text-white">
                          Дууссан
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {searchResults.length > 20 && (
                <div className="mt-2 px-2 py-3 text-center text-xs text-[#6B7280]">
                  Эхний 20 үр дүнг харуулж байна
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="border-t border-[#E5E7EB] p-3 text-center">
            <p className="text-xs text-[#6B7280]">
              <kbd className="rounded bg-[#F3F4F6] px-2 py-1 font-mono text-xs">ESC</kbd>
              {' '}дарж хаах
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}