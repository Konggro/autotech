import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopBar } from '../../components/admin/AdminTopBar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Upload, X, Plus } from 'lucide-react';
import { refreshProducts, useProducts } from '../../lib/use-products';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export function AdminProductFormPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { products } = useProducts();
  const existingProduct = products.find(p => p.id === id);
  const brandSuggestions = Array.from(
    new Set(products.map((product) => product.brand).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    brand: existingProduct?.brand || '',
    category: existingProduct?.category || '',
    price: existingProduct?.price ? String(existingProduct.price) : '',
    salePrice: existingProduct?.salePrice ? String(existingProduct.salePrice) : '',
    description: existingProduct?.description || '',
    stock: existingProduct?.stock || 'in-stock',
    stockCount: existingProduct?.stockCount ? String(existingProduct.stockCount) : '',
    featured: existingProduct?.featured || false,
    new: existingProduct?.new || false,
  });

  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    existingProduct?.specs
      ? Object.entries(existingProduct.specs).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );
  const [mainImage, setMainImage] = useState(existingProduct?.image || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(existingProduct?.images || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!existingProduct) return;
    setFormData({
      name: existingProduct.name || '',
      brand: existingProduct.brand || '',
      category: existingProduct.category || '',
      price: existingProduct.price ? String(existingProduct.price) : '',
      salePrice: existingProduct.salePrice ? String(existingProduct.salePrice) : '',
      description: existingProduct.description || '',
      stock: existingProduct.stock || 'in-stock',
      stockCount: existingProduct.stockCount ? String(existingProduct.stockCount) : '',
      featured: existingProduct.featured || false,
      new: existingProduct.new || false,
    });
    setSpecs(
      existingProduct.specs
        ? Object.entries(existingProduct.specs).map(([key, value]) => ({ key, value }))
        : [{ key: '', value: '' }],
    );
    setMainImage(existingProduct.image || '');
    setGalleryImages(existingProduct.images || []);
  }, [existingProduct]);

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    if (!isSupabaseConfigured || !supabase) {
      alert('Supabase тохиргоо дутуу байна.');
      return null;
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      alert(`${file.name} файл 5MB-аас их байна.`);
      return null;
    }

    if (!file.type.startsWith('image/')) {
      alert(`${file.name} нь зураг файл биш байна.`);
      return null;
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      console.error('Failed to upload image:', uploadError);
      alert(
        'Зураг оруулах үед алдаа гарлаа. Supabase дээр `product-images` bucket болон storage policy тохируулсан эсэхийг шалгана уу.',
      );
      return null;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    const uploadedUrl = await uploadImageToStorage(file);
    if (uploadedUrl) {
      setMainImage(uploadedUrl);
    }
    setUploading(false);
  };

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    const remainingSlots = Math.max(0, 10 - galleryImages.length);
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      alert(`Нэмэлт зураг 10-аас их байж болохгүй. Эхний ${remainingSlots} зургийг орууллаа.`);
    }

    setUploading(true);
    const uploadedUrls = await Promise.all(filesToUpload.map((file) => uploadImageToStorage(file)));
    const validUrls = uploadedUrls.filter((url): url is string => Boolean(url));
    if (validUrls.length > 0) {
      setGalleryImages((prev) => [...prev, ...validUrls].slice(0, 10));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      alert('Supabase тохиргоо дутуу байна.');
      return;
    }

    const specsObject = specs.reduce<Record<string, string>>((acc, item) => {
      if (item.key.trim() && item.value.trim()) {
        acc[item.key.trim()] = item.value.trim();
      }
      return acc;
    }, {});

    const parsedPrice = Number(formData.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      alert('Үнэ зөв оруулна уу (0-ээс их).');
      return;
    }

    const parsedSalePrice =
      formData.salePrice.trim() === '' ? null : Number(formData.salePrice);
    if (
      parsedSalePrice !== null &&
      (!Number.isFinite(parsedSalePrice) || parsedSalePrice < 0)
    ) {
      alert('Хямдарсан үнэ зөв оруулна уу.');
      return;
    }

    const parsedStockCount =
      formData.stockCount.trim() === '' ? 0 : Number(formData.stockCount);
    if (!Number.isFinite(parsedStockCount) || parsedStockCount < 0) {
      alert('Тоо ширхэг зөв оруулна уу (0 эсвэл түүнээс их).');
      return;
    }

    const payload = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      price: parsedPrice,
      sale_price: parsedSalePrice,
      description: formData.description || null,
      stock: formData.stock,
      stock_count: parsedStockCount,
      featured: formData.featured,
      is_new: formData.new,
      specs: specsObject,
      image: mainImage || null,
      images: galleryImages,
    };

    const { error } = isEdit
      ? await supabase.from('products').update(payload).eq('id', id!)
      : await supabase.from('products').insert(payload);

    if (error) {
      console.error('Failed to save product:', error);
      alert('Бүтээгдэхүүн хадгалахад алдаа гарлаа.');
      return;
    }

    alert('Бүтээгдэхүүн амжилттай хадгалагдлаа!');
    localStorage.removeItem(`product_draft_${id ?? 'new'}`);
    await refreshProducts();
    navigate('/admin/products');
  };

  const handleSaveDraft = () => {
    const draftPayload = {
      formData,
      specs,
      mainImage,
      galleryImages,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`product_draft_${id ?? 'new'}`, JSON.stringify(draftPayload));
    alert('Ноорог амжилттай хадгалагдлаа.');
  };

  const handlePreview = () => {
    if (!isEdit || !id) {
      alert('Урьдчилан харахын тулд эхлээд бүтээгдэхүүнээ хадгална уу.');
      return;
    }
    window.open(`/product/${id}`, '_blank');
  };

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 lg:ml-[260px]">
        <AdminTopBar title={isEdit ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн нэмэх'} onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
              {/* Main Content - Left */}
              <div className="space-y-4 lg:space-y-6 lg:col-span-2">
                {/* Basic Information */}
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 lg:mb-6 font-bold text-black">
                    Үндсэн мэдээлэл
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">
                        Бүтээгдэхүүний нэр <span className="text-[#DC2626]">*</span>
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="ж-нь: Michelin Pilot Sport 4"
                        className="mt-2 h-12 lg:h-14"
                      />
                      <p className="mt-1 text-xs text-[#6B7280]">
                        {formData.name.length}/200 тэмдэгт
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description">
                        Тайлбар <span className="text-[#DC2626]">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        required
                        rows={6}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар..."
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 lg:mb-6 font-bold text-black">
                    Бүтээгдэхүүний зураг
                  </h2>

                  <div className="mb-4">
                    <Label>Үндсэн зураг</Label>
                    <label
                      htmlFor="main-image-upload"
                      className="mt-2 flex h-48 lg:h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] transition-colors hover:border-[#DC2626]"
                    >
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt="Үндсэн зураг"
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <>
                          <Upload className="mb-2 h-10 w-10 lg:h-12 lg:w-12 text-[#6B7280]" />
                          <p className="text-sm text-[#6B7280] px-4 text-center">
                            Зургаа энд чирж оруулах эсвэл дарж оруулах
                          </p>
                          <p className="mt-1 text-xs text-[#9CA3AF]">
                            JPG, PNG, WebP. Хамгийн ихдээ 5MB
                          </p>
                        </>
                      )}
                    </label>
                    <input
                      id="main-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMainImageUpload}
                    />
                    {mainImage && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setMainImage('')}
                      >
                        Үндсэн зураг устгах
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label>Нэмэлт зургууд (хамгийн ихдээ 10)</Label>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                      {galleryImages.map((imageUrl, index) => (
                        <div
                          key={imageUrl}
                          className="relative aspect-square overflow-hidden rounded-lg border border-[#E5E7EB]"
                        >
                          <img
                            src={imageUrl}
                            alt={`Нэмэлт зураг ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-2 rounded-full bg-white p-1 shadow"
                            onClick={() =>
                              setGalleryImages((prev) =>
                                prev.filter((_, currentIndex) => currentIndex !== index),
                              )
                            }
                          >
                            <X className="h-4 w-4 text-[#DC2626]" />
                          </button>
                        </div>
                      ))}
                      {galleryImages.length < 10 && (
                        <label
                          htmlFor="gallery-images-upload"
                          className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#DC2626]"
                        >
                          <Plus className="h-6 w-6 text-[#6B7280]" />
                        </label>
                      )}
                    </div>
                    <input
                      id="gallery-images-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryImagesUpload}
                    />
                    <p className="mt-2 text-xs text-[#6B7280]">
                      {galleryImages.length}/10 зураг
                    </p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 lg:mb-6 font-bold text-black">Үнийн мэдээлэл</h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="price">
                        Үнэ (₮) <span className="text-[#DC2626]">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>

                    <div>
                      <Label htmlFor="salePrice">
                        Хямдарсан үнэ (₮)
                      </Label>
                      <Input
                        id="salePrice"
                        type="number"
                        value={formData.salePrice}
                        onChange={(e) =>
                          setFormData({ ...formData, salePrice: e.target.value })
                        }
                        placeholder="Хямдралтай бол"
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <div className="mb-4 lg:mb-6 flex items-center justify-between">
                    <h2 className="font-bold text-black">Техникийн үзүүлэлт</h2>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSpec}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Үзүүлэлт нэмэх</span>
                      <span className="sm:hidden">Нэмэх</span>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {specs.map((spec, index) => (
                      <div key={index} className="flex gap-2 lg:gap-3">
                        <Input
                          placeholder="Үзүүлэлтийн нэр"
                          value={spec.key}
                          onChange={(e) => updateSpec(index, 'key', e.target.value)}
                          className="flex-1 h-10 lg:h-auto"
                        />
                        <Input
                          placeholder="Утга"
                          value={spec.value}
                          onChange={(e) => updateSpec(index, 'value', e.target.value)}
                          className="flex-1 h-10 lg:h-auto"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSpec(index)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4 text-[#DC2626]" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inventory */}
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 lg:mb-6 font-bold text-black">Нөөц бараа</h2>

                  <div className="space-y-4">
                    <div>
                      <Label>Нөөцийн байдал</Label>
                      <RadioGroup
                        value={formData.stock}
                        onValueChange={(value) =>
                          setFormData({ ...formData, stock: value as any })
                        }
                        className="mt-2 space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="in-stock" id="in-stock" />
                          <Label htmlFor="in-stock" className="font-normal">
                            Нөөцтэй
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="limited" id="limited" />
                          <Label htmlFor="limited" className="font-normal">
                            Хязгаарлагдмал
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="out-of-stock" id="out-of-stock" />
                          <Label htmlFor="out-of-stock" className="font-normal">
                            Дууссан
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="stockCount">Тоо ширхэг</Label>
                      <Input
                        id="stockCount"
                        type="number"
                        value={formData.stockCount}
                        onChange={(e) =>
                          setFormData({ ...formData, stockCount: e.target.value })
                        }
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Right */}
              <div className="space-y-4 lg:space-y-6">
                {/* Publish */}
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 lg:mb-6 font-bold text-black">Нийтлэх</h2>

                  <div className="space-y-3 lg:space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-10 lg:h-auto"
                      onClick={handleSaveDraft}
                    >
                      Ноорог хадгалах
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-10 lg:h-auto"
                      onClick={handlePreview}
                    >
                      Урьдчилан үзэх
                    </Button>
                    <Button
                      type="submit"
                      className="w-full bg-[#DC2626] hover:bg-[#B91C1C] h-10 lg:h-auto"
                      disabled={uploading}
                    >
                      {uploading ? 'Зураг оруулж байна...' : 'Нийтлэх'}
                    </Button>
                  </div>
                </div>

                {/* Category */}
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 font-bold text-black">Ангилал</h2>

                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="h-10 lg:h-auto">
                      <SelectValue placeholder="Ангилал сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cars">Машин</SelectItem>
                      <SelectItem value="Tires">Дугуй</SelectItem>
                      <SelectItem value="Wheels">Обуд</SelectItem>
                      <SelectItem value="Brake Parts">Тоормосны эд анги</SelectItem>
                      <SelectItem value="Suspension">Түдгэлзүүлэлт</SelectItem>
                      <SelectItem value="Accessories">Нэмэлт хэрэгсэл</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand */}
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 font-bold text-black">Брэнд</h2>

                  <Input
                    list="brand-suggestions"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="Брэндийн нэр оруулах"
                    className="h-10 lg:h-auto"
                    required
                  />
                  <datalist id="brand-suggestions">
                    {brandSuggestions.map((brand) => (
                      <option key={brand} value={brand} />
                    ))}
                  </datalist>
                  {/* Keep quick-pick menu for convenience */}
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, brand: value })
                    }
                  >
                    <SelectTrigger className="mt-2 h-10 lg:h-auto">
                      <SelectValue placeholder="Түгээмэл брэндээс сонгох (сонголттой)" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandSuggestions.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured */}
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 font-bold text-black">Онцлох</h2>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, featured: checked as boolean })
                        }
                      />
                      <Label htmlFor="featured" className="font-normal">
                        Онцлох бүтээгдэхүүн
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new"
                        checked={formData.new}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, new: checked as boolean })
                        }
                      />
                      <Label htmlFor="new" className="font-normal">
                        Шинэ бүтээгдэхүүн
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}