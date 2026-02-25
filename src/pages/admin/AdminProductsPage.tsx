import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopBar } from '../../components/admin/AdminTopBar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Plus, Search, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { useProducts } from '../../lib/use-products';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export function AdminProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { products } = useProducts();
  const [localProducts, setLocalProducts] = useState(products);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  let filteredProducts = localProducts;

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (categoryFilter !== 'all') {
    filteredProducts = filteredProducts.filter(p =>
      p.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  if (stockFilter !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.stock === stockFilter);
  }

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, safeCurrentPage]);

  const startNumber = filteredProducts.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endNumber = Math.min(safeCurrentPage * pageSize, filteredProducts.length);

  const handleExportCsv = () => {
    if (filteredProducts.length === 0) {
      alert('Экспорт хийх бүтээгдэхүүн алга байна.');
      return;
    }

    const escapeCsvValue = (value: string | number | null | undefined) => {
      const text = String(value ?? '');
      return `"${text.replace(/"/g, '""')}"`;
    };

    const csvHeaders = ['id', 'name', 'brand', 'category', 'price', 'stock', 'stockCount'];
    const csvRows = filteredProducts.map((product) =>
      [
        product.id,
        product.name,
        product.brand,
        product.category,
        product.price,
        product.stock,
        product.stockCount ?? '',
      ]
        .map(escapeCsvValue)
        .join(','),
    );

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    const confirmed = window.confirm(`"${productName}" бүтээгдэхүүнийг устгах уу?`);
    if (!confirmed) return;

    if (!isSupabaseConfigured || !supabase) {
      alert('Supabase тохиргоо дутуу байна.');
      return;
    }

    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Failed to delete product:', error);
      alert('Бүтээгдэхүүн устгахад алдаа гарлаа.');
      return;
    }

    setLocalProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 lg:ml-[260px]">
        <AdminTopBar title="Бүх бүтээгдэхүүн" onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-8">
          {/* Header Actions */}
          <div className="mb-4 lg:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-[#6B7280]">
                Нийт {filteredProducts.length} бүтээгдэхүүн
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportCsv}>
                Экспорт CSV
              </Button>
              <Button
                asChild
                className="bg-[#DC2626] hover:bg-[#B91C1C] w-full sm:w-auto"
              >
                <Link to="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Шинэ бүтээгдэхүүн нэмэх
                </Link>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 lg:mb-6 rounded-lg bg-white p-3 lg:p-4 shadow-sm">
            <div className="grid gap-3 lg:gap-4 md:grid-cols-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                <Input
                  placeholder="Нэр, SKU, брэндээр хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 lg:h-auto"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10 lg:h-auto">
                  <SelectValue placeholder="Ангилал" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Бүх ангилал</SelectItem>
                  <SelectItem value="cars">Машин</SelectItem>
                  <SelectItem value="tires">Дугуй</SelectItem>
                  <SelectItem value="wheels">Обуд</SelectItem>
                  <SelectItem value="brake parts">Тоормосны эд анги</SelectItem>
                  <SelectItem value="accessories">Нэмэлт хэрэгсэл</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="h-10 lg:h-auto">
                  <SelectValue placeholder="Нөөцийн байдал" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Бүх төлөв</SelectItem>
                  <SelectItem value="in-stock">Нөөцтэй</SelectItem>
                  <SelectItem value="limited">Хязгаарлагдмал</SelectItem>
                  <SelectItem value="out-of-stock">Дууссан</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-lg bg-white shadow-sm">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full lg:w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Зураг
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Бүтээгдэхүүний нэр
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Ангилал
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap hidden sm:table-cell">
                        Брэнд
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Үнэ
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap hidden md:table-cell">
                        Нөөц
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Үйлдэл
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                      >
                        <td className="p-2 lg:p-4">
                          <img
                            src={product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop'}
                            alt={product.name}
                            className="h-12 w-12 lg:h-16 lg:w-16 rounded object-cover"
                          />
                        </td>
                        <td className="p-2 lg:p-4">
                          <div className="font-medium text-black text-sm lg:text-base">
                            {product.name}
                          </div>
                          <div className="text-xs text-[#6B7280]">
                            SKU: {product.id}
                          </div>
                        </td>
                        <td className="p-2 lg:p-4">
                          <span className="rounded-full bg-[#F3F4F6] px-2 lg:px-3 py-1 text-xs whitespace-nowrap">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-2 lg:p-4 text-[#374151] text-sm hidden sm:table-cell">
                          {product.brand}
                        </td>
                        <td className="p-2 lg:p-4 font-bold text-[#DC2626] text-sm lg:text-base whitespace-nowrap">
                          ₮ {product.price.toLocaleString()}
                        </td>
                        <td className="p-2 lg:p-4 hidden md:table-cell">
                          <span
                            className={`rounded-full px-2 lg:px-3 py-1 text-xs text-white whitespace-nowrap ${
                              product.stock === 'in-stock'
                                ? 'bg-[#10B981]'
                                : product.stock === 'limited'
                                ? 'bg-[#F59E0B]'
                                : 'bg-[#6B7280]'
                            }`}
                          >
                            {product.stock === 'in-stock'
                              ? 'Нөөцтэй'
                              : product.stock === 'limited'
                              ? 'Хязгаарлагдмал'
                              : 'Дууссан'}
                          </span>
                        </td>
                        <td className="p-2 lg:p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-10 lg:w-10">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/products/edit/${product.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Засах
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/product/${product.id}`} target="_blank">
                                  Үзэх
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-[#DC2626]"
                                onClick={() => {
                                  void handleDeleteProduct(product.id, product.name);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Устгах
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#E5E7EB] p-3 lg:p-4 gap-3">
              <p className="text-sm text-[#6B7280]">
                {startNumber}-{endNumber} /{' '}
                {filteredProducts.length} бүтээгдэхүүн
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Өмнөх
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Дараах
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}