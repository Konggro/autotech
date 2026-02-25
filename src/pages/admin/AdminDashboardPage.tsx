import { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopBar } from '../../components/admin/AdminTopBar';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router';
import {
  Plus, Edit, Trash2
} from 'lucide-react';
import { useProducts } from '../../lib/use-products';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { products } = useProducts();
  const [localProducts, setLocalProducts] = useState(products);
  const pageSize = 5;

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const totalPages = Math.max(1, Math.ceil(localProducts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const recentProducts = localProducts.slice(startIndex, startIndex + pageSize);

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

  const startDisplay = localProducts.length === 0 ? 0 : startIndex + 1;
  const endDisplay = Math.min(startIndex + pageSize, localProducts.length);

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 lg:ml-[260px]">
        <AdminTopBar title="Dashboard Overview" onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-8">
          {/* Quick Actions */}
          <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row gap-3 lg:gap-4">
            <Button
              asChild
              className="bg-[#DC2626] hover:bg-[#B91C1C] w-full sm:w-auto"
            >
              <Link to="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link to="/admin/settings">Manage Settings</Link>
            </Button>
          </div>

          {/* Recent Products */}
          <div className="rounded-lg bg-white p-4 lg:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <h2 className="mb-4 lg:mb-6 font-bold text-black">Recent Products Added</h2>

            <div className="overflow-x-auto -mx-4 lg:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full lg:w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] text-left">
                      <th className="pb-3 pl-4 lg:pl-0 text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Image
                      </th>
                      <th className="pb-3 px-2 lg:px-0 text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Product Name
                      </th>
                      <th className="pb-3 px-2 lg:px-0 text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Category
                      </th>
                      <th className="pb-3 px-2 lg:px-0 text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Price
                      </th>
                      <th className="pb-3 px-2 lg:px-0 text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Stock
                      </th>
                      <th className="pb-3 pr-4 lg:pr-0 text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                      >
                        <td className="py-3 lg:py-4 pl-4 lg:pl-0">
                          <img
                            src={product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop'}
                            alt={product.name}
                            className="h-10 w-10 lg:h-12 lg:w-12 rounded object-cover"
                          />
                        </td>
                        <td className="py-3 lg:py-4 px-2 lg:px-0">
                          <div className="font-medium text-black text-sm lg:text-base">
                            {product.name}
                          </div>
                          <div className="text-xs text-[#6B7280]">
                            SKU: {product.id}
                          </div>
                        </td>
                        <td className="py-3 lg:py-4 px-2 lg:px-0">
                          <span className="rounded-full bg-[#F3F4F6] px-2 lg:px-3 py-1 text-xs whitespace-nowrap">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 lg:py-4 px-2 lg:px-0 font-bold text-[#DC2626] text-sm lg:text-base whitespace-nowrap">
                          ₮ {product.price.toLocaleString()}
                        </td>
                        <td className="py-3 lg:py-4 px-2 lg:px-0">
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
                              ? 'In Stock'
                              : product.stock === 'limited'
                              ? 'Limited'
                              : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3 lg:py-4 pr-4 lg:pr-0">
                          <div className="flex gap-1 lg:gap-2">
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 lg:h-10 lg:w-10">
                              <Link to={`/admin/products/edit/${product.id}`}>
                                <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 lg:h-10 lg:w-10"
                              onClick={() => {
                                void handleDeleteProduct(product.id, product.name);
                              }}
                            >
                              <Trash2 className="h-3 w-3 lg:h-4 lg:w-4 text-[#DC2626]" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row justify-between gap-3">
              <p className="text-sm text-[#6B7280]">
                Showing {startDisplay}-{endDisplay} of {localProducts.length} products
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}