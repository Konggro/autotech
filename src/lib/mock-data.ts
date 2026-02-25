// Mock data for the AutoTech.mn website

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  salePrice?: number;
  image: string;
  images?: string[];
  specs?: Record<string, string>;
  description?: string;
  stock: 'in-stock' | 'limited' | 'out-of-stock';
  stockCount?: number;
  featured?: boolean;
  new?: boolean;
  rating?: number;
  reviews?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Машин', slug: 'cars', icon: 'car', count: 28 },
  { id: '2', name: 'Дугуй', slug: 'tires', icon: 'circle', count: 156 },
  { id: '3', name: 'Обуд', slug: 'wheels', icon: 'disc', count: 89 },
  { id: '4', name: 'Тоормосны эд анги', slug: 'brake-parts', icon: 'disc-3', count: 67 },
  { id: '5', name: 'Түдгэлзүүлэлт', slug: 'suspension', icon: 'move-vertical', count: 45 },
  { id: '6', name: 'Нэмэлт хэрэгсэл', slug: 'accessories', icon: 'wrench', count: 112 },
  { id: '7', name: 'Шүүлтүүр & Шингэн', slug: 'filters-fluids', icon: 'droplet', count: 78 },
  { id: '8', name: 'Зай', slug: 'batteries', icon: 'battery', count: 34 },
  { id: '9', name: 'Гэрэлтүүлэг', slug: 'lighting', icon: 'lightbulb', count: 56 },
];

export const brands: Brand[] = [
  { id: '1', name: 'Toyota', logo: '' },
  { id: '2', name: 'Honda', logo: '' },
  { id: '3', name: 'BMW', logo: '' },
  { id: '4', name: 'Mercedes-Benz', logo: '' },
  { id: '5', name: 'Hyundai', logo: '' },
  { id: '6', name: 'Nissan', logo: '' },
  { id: '7', name: 'Michelin', logo: '' },
  { id: '8', name: 'Bridgestone', logo: '' },
  { id: '9', name: 'Continental', logo: '' },
  { id: '10', name: 'Pirelli', logo: '' },
  { id: '11', name: 'BBS', logo: '' },
  { id: '12', name: 'Enkei', logo: '' },
  { id: '13', name: 'Bosch', logo: '' },
  { id: '14', name: 'Brembo', logo: '' },
];

export const products: Product[] = [
  // Cars
  {
    id: 'car-1',
    name: 'Camry 2.5 Hybrid',
    brand: 'Toyota',
    category: 'Cars',
    price: 95000000,
    image: '',
    specs: {
      'Он': '2023',
      'Хөдөлгүүр': '2.5L Hybrid',
      'Хүч': '218 hp',
      'Хурд хайрцаг': 'CVT',
      'Явсан км': '12,500 км',
      'Түлш': 'Бензин/Цахилгаан'
    },
    description: 'Найдвартай, эдийн засгийн Toyota Camry Hybrid. Бага түлш зарцуулалттай, өндөр чанартай.',
    stock: 'in-stock',
    stockCount: 2,
    featured: true,
    new: true,
    rating: 4.9,
    reviews: 45
  },
  {
    id: 'car-2',
    name: 'CR-V 1.5 Turbo AWD',
    brand: 'Honda',
    category: 'Cars',
    price: 88000000,
    image: '',
    specs: {
      'Он': '2022',
      'Хөдөлгүүр': '1.5L Turbo',
      'Хүч': '190 hp',
      'Хурд хайрцаг': 'CVT',
      'Явсан км': '28,000 км',
      'Түлш': 'Бензин'
    },
    description: 'Тав тухтай, өргөн сүлжээтэй Honda CR-V. 4х4 системтэй, гэр бүлийн машин.',
    stock: 'in-stock',
    stockCount: 1,
    featured: true,
    rating: 4.7,
    reviews: 32
  },
  {
    id: 'car-3',
    name: 'X5 xDrive40i M Sport',
    brand: 'BMW',
    category: 'Cars',
    price: 185000000,
    salePrice: 175000000,
    image: '',
    specs: {
      'Он': '2022',
      'Хөдөлгүүр': '3.0L I6 Turbo',
      'Хүч': '335 hp',
      'Хурд хайрцаг': '8-Speed Automatic',
      'Явсан км': '18,500 км',
      'Түлш': 'Бензин'
    },
    description: 'Тансаг зэрэглэлийн BMW X5. M Sport багц, дэвшилтэт технологи, гайхалтай ажиллагаа.',
    stock: 'limited',
    stockCount: 1,
    featured: true,
    rating: 4.9,
    reviews: 28
  },
  {
    id: 'car-4',
    name: 'E-Class E300 AMG Line',
    brand: 'Mercedes-Benz',
    category: 'Cars',
    price: 195000000,
    image: '',
    specs: {
      'Он': '2023',
      'Хөдөлгүүр': '2.0L Turbo',
      'Хүч': '258 hp',
      'Хурд хайрцаг': '9G-TRONIC',
      'Явсан км': '8,200 км',
      'Түлш': 'Бензин'
    },
    description: 'Шинэ загварын Mercedes-Benz E-Class. AMG Line, дэвшилтэт аюулгүй байдал, тансаг дотоод.',
    stock: 'in-stock',
    stockCount: 1,
    featured: true,
    new: true,
    rating: 5.0,
    reviews: 18
  },
  {
    id: 'car-5',
    name: 'Tucson 2.5 Turbo AWD',
    brand: 'Hyundai',
    category: 'Cars',
    price: 78000000,
    image: '',
    specs: {
      'Он': '2023',
      'Хөдөлгүүр': '2.5L Turbo',
      'Хүч': '281 hp',
      'Хурд хайрцаг': '8-Speed Automatic',
      'Явсан км': '15,000 км',
      'Түлш': 'Бензин'
    },
    description: 'Орчин үеийн дизайнтай Hyundai Tucson. Хүчирхэг хөдөлгүүр, сайн тоноглол.',
    stock: 'in-stock',
    stockCount: 3,
    rating: 4.6,
    reviews: 52
  },
  {
    id: 'car-6',
    name: 'Patrol Y62 Platinum',
    brand: 'Nissan',
    category: 'Cars',
    price: 165000000,
    image: '',
    specs: {
      'Он': '2021',
      'Хөдөлгүүр': '5.6L V8',
      'Хүч': '400 hp',
      'Хурд хайрцаг': '7-Speed Automatic',
      'Явсан км': '45,000 км',
      'Түлш': 'Бензин'
    },
    description: 'Хүчирхэг Nissan Patrol. V8 хөдөлгүүр, 7 суудалтай, off-road чадвартай.',
    stock: 'in-stock',
    stockCount: 1,
    rating: 4.8,
    reviews: 35
  },
  {
    id: 'car-7',
    name: 'Land Cruiser Prado 2.8D',
    brand: 'Toyota',
    category: 'Cars',
    price: 145000000,
    image: '',
    specs: {
      'Он': '2022',
      'Хөдөлгүүр': '2.8L Diesel',
      'Хүч': '204 hp',
      'Хурд хайрцаг': '6-Speed Automatic',
      'Явсан км': '32,000 км',
      'Түлш': 'Дизель'
    },
    description: 'Найдвартай Toyota Land Cruiser Prado. Дизель хөдөлгүүр, 4х4 систем.',
    stock: 'limited',
    stockCount: 1,
    rating: 4.8,
    reviews: 41
  },
  {
    id: 'car-8',
    name: 'Accord Sport 1.5T',
    brand: 'Honda',
    category: 'Cars',
    price: 72000000,
    salePrice: 68000000,
    image: '',
    specs: {
      'Он': '2022',
      'Хөдөлгүүр': '1.5L Turbo',
      'Хүч': '192 hp',
      'Хурд хайрцаг': 'CVT',
      'Явсан км': '22,500 км',
      'Түлш': 'Бензин'
    },
    description: 'Спортлог загвартай Honda Accord. Эдийн засгийн, найдвартай седан.',
    stock: 'in-stock',
    stockCount: 2,
    new: true,
    rating: 4.7,
    reviews: 38
  },
  {
    id: 'car-9',
    name: '3 Series 330i M Sport',
    brand: 'BMW',
    category: 'Cars',
    price: 142000000,
    image: '',
    specs: {
      'Он': '2023',
      'Хөдөлгүүр': '2.0L Turbo',
      'Хүч': '255 hp',
      'Хурд хайрцаг': '8-Speed Automatic',
      'Явсан км': '6,800 км',
      'Түлш': 'Бензин'
    },
    description: 'Шинэ BMW 3 Series. M Sport багц, дэвшилтэт технологи, спортлог ажиллагаа.',
    stock: 'in-stock',
    stockCount: 1,
    featured: true,
    rating: 4.9,
    reviews: 24
  },
  {
    id: 'car-10',
    name: 'Santa Fe Calligraphy',
    brand: 'Hyundai',
    category: 'Cars',
    price: 92000000,
    image: '',
    specs: {
      'Он': '2023',
      'Хөдөлгүүр': '2.5L Turbo',
      'Хүч': '277 hp',
      'Хурд хайрцаг': '8-Speed Automatic',
      'Явсан км': '11,200 км',
      'Түлш': 'Бензин'
    },
    description: 'Тансаг зэрэглэлийн Hyundai Santa Fe. 3 эгнээ суудалтай, дэвшилтэт систем.',
    stock: 'in-stock',
    stockCount: 2,
    rating: 4.7,
    reviews: 46
  },
  // Existing tire and parts products
  {
    id: '1',
    name: 'Pilot Sport 4 205/55R16 91W',
    brand: 'Michelin',
    category: 'Tires',
    price: 450000,
    image: '',
    specs: {
      'Size': '205/55R16',
      'Load Index': '91',
      'Speed Rating': 'W',
      'Season': 'Summer',
      'Tread Depth': '7.5mm'
    },
    description: 'Premium summer tire with exceptional grip and handling for sporty driving.',
    stock: 'in-stock',
    stockCount: 24,
    featured: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: '2',
    name: 'Blizzak WS90 215/60R17 96H',
    brand: 'Bridgestone',
    category: 'Tires',
    price: 520000,
    salePrice: 470000,
    image: '',
    specs: {
      'Size': '215/60R17',
      'Load Index': '96',
      'Speed Rating': 'H',
      'Season': 'Winter'
    },
    description: 'Superior winter tire with enhanced traction on ice and snow.',
    stock: 'in-stock',
    stockCount: 18,
    featured: true,
    new: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: '3',
    name: 'RS-R 18x8.5 5x114.3 +45',
    brand: 'Enkei',
    category: 'Wheels',
    price: 780000,
    image: '',
    specs: {
      'Diameter': '18"',
      'Width': '8.5"',
      'Bolt Pattern': '5x114.3',
      'Offset': '+45mm',
      'Finish': 'Matte Black'
    },
    description: 'Lightweight racing wheel with MAT process technology.',
    stock: 'limited',
    stockCount: 3,
    featured: true,
    rating: 4.7,
    reviews: 89
  },
  {
    id: '4',
    name: 'PremiumContact 6 225/45R18 95Y',
    brand: 'Continental',
    category: 'Tires',
    price: 495000,
    image: '',
    specs: {
      'Size': '225/45R18',
      'Load Index': '95',
      'Speed Rating': 'Y',
      'Season': 'Summer'
    },
    stock: 'in-stock',
    stockCount: 32,
    featured: true,
    rating: 4.6,
    reviews: 156
  },
  {
    id: '5',
    name: 'GT Disc Brake Kit Front',
    brand: 'Brembo',
    category: 'Brake Parts',
    price: 1250000,
    image: '',
    specs: {
      'Type': 'Disc Brake Kit',
      'Position': 'Front',
      'Rotor Size': '355mm',
      'Caliper': '6-Piston'
    },
    description: 'High-performance brake system for superior stopping power.',
    stock: 'in-stock',
    stockCount: 8,
    featured: true,
    rating: 4.9,
    reviews: 67
  },
  {
    id: '6',
    name: 'Cinturato P7 225/50R17 94W',
    brand: 'Pirelli',
    category: 'Tires',
    price: 485000,
    image: '',
    specs: {
      'Size': '225/50R17',
      'Season': 'All-Season'
    },
    stock: 'in-stock',
    featured: true,
    rating: 4.5,
    reviews: 98
  },
  {
    id: '7',
    name: 'LM Racing 19x9.5 5x120 +35',
    brand: 'BBS',
    category: 'Wheels',
    price: 1450000,
    image: '',
    specs: {
      'Diameter': '19"',
      'Width': '9.5"',
      'Bolt Pattern': '5x120'
    },
    stock: 'limited',
    stockCount: 2,
    rating: 4.8,
    reviews: 45
  },
  {
    id: '8',
    name: 'AeroTwin Wiper Blade Set',
    brand: 'Bosch',
    category: 'Accessories',
    price: 45000,
    image: '',
    stock: 'in-stock',
    stockCount: 67,
    rating: 4.4,
    reviews: 234
  },
];

export const heroSlides = [
  {
    id: 1,
    title: 'Premium Tires for Every Season',
    subtitle: 'Experience superior performance and safety',
    cta: 'Shop Now',
    image: ''
  },
  {
    id: 2,
    title: 'Upgrade Your Ride with Custom Wheels',
    subtitle: 'Exclusive designs from world-leading brands',
    cta: 'View Collection',
    image: ''
  },
  {
    id: 3,
    title: 'Quality Parts, Expert Service',
    subtitle: 'Your trusted automotive partner in Mongolia',
    cta: 'Learn More',
    image: ''
  }
];

export const features = [
  {
    icon: 'shield-check',
    title: 'Quality Guarantee',
    description: '100% authentic products from authorized distributors'
  },
  {
    icon: 'headphones',
    title: 'Expert Support',
    description: 'Professional advice from experienced technicians'
  },
  {
    icon: 'package',
    title: 'Wide Selection',
    description: '1000+ products for all vehicle makes and models'
  },
  {
    icon: 'tag',
    title: 'Best Prices',
    description: 'Competitive pricing with flexible payment options'
  }
];