import type { Product } from './mock-data';
import { products as mockProducts } from './mock-data';
import { supabase, isSupabaseConfigured } from './supabase';

type ProductRow = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  sale_price: number | null;
  image: string | null;
  images: string[] | null;
  specs: Record<string, string> | null;
  description: string | null;
  stock: Product['stock'];
  stock_count: number | null;
  featured: boolean | null;
  is_new: boolean | null;
  rating: number | null;
  reviews: number | null;
  created_at: string;
};

export type InquiryStatus = 'new' | 'in-progress' | 'completed';

export type Inquiry = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  product?: string;
  date: string;
  status: InquiryStatus;
};

type InquiryRow = {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  products: { name: string } | null;
};

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: row.price,
    salePrice: row.sale_price ?? undefined,
    image: row.image ?? '',
    images: row.images ?? undefined,
    specs: row.specs ?? undefined,
    description: row.description ?? undefined,
    stock: row.stock,
    stockCount: row.stock_count ?? undefined,
    featured: row.featured ?? false,
    new: row.is_new ?? false,
    rating: row.rating ?? undefined,
    reviews: row.reviews ?? undefined,
  };
}

function mapInquiryRow(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone ?? '',
    subject: row.subject,
    message: row.message,
    product: row.products?.name,
    date: new Date(row.created_at).toISOString().slice(0, 10),
    status: row.status,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) return mockProducts;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch products from Supabase:', error);
    return mockProducts;
  }

  return (data as ProductRow[]).map(mapProductRow);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockProducts.find((product) => product.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    console.error('Failed to fetch product by id from Supabase:', error);
    return null;
  }

  return mapProductRow(data as ProductRow);
}

export async function fetchAdminInquiries(): Promise<Inquiry[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('inquiries')
    .select('id, customer_name, email, phone, subject, message, status, created_at, products(name)')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch inquiries from Supabase:', error);
    return [];
  }

  return (data as InquiryRow[]).map(mapInquiryRow);
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
  if (error) {
    console.error('Failed to update inquiry status:', error);
    return false;
  }
  return true;
}
