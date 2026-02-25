import { Link } from 'react-router';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="mb-3 flex items-center md:mb-4">
              <span className="text-xl font-bold text-white md:text-[24px]">AutoTech</span>
              <span className="text-xl font-bold text-[#DC2626] md:text-[24px]">.mn</span>
            </div>
            <p className="mb-3 text-sm text-[#E5E7EB] md:mb-4">
              Таны найдвартай автомашины эд ангийн түнш
            </p>
            <div className="space-y-2 text-sm text-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Ulaanbaatar, Mongolia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+976 7777 7777</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@autotech.mn</span>
              </div>
            </div>
            <div className="mt-3 flex gap-3 md:mt-4 md:gap-4">
              <a
                href="#"
                className="text-white transition-colors hover:text-[#DC2626]"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white transition-colors hover:text-[#DC2626]"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white transition-colors hover:text-[#DC2626]"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold md:mb-4 md:text-base">Ангилал</h3>
            <ul className="space-y-2 text-sm text-[#E5E7EB]">
              <li>
                <Link
                  to="/products/cars"
                  className="transition-colors hover:text-white"
                >
                  Машин
                </Link>
              </li>
              <li>
                <Link
                  to="/products/tires"
                  className="transition-colors hover:text-white"
                >
                  Дугуй
                </Link>
              </li>
              <li>
                <Link
                  to="/products/wheels"
                  className="transition-colors hover:text-white"
                >
                  Обуд
                </Link>
              </li>
              <li>
                <Link
                  to="/products/brake-parts"
                  className="transition-colors hover:text-white"
                >
                  Тоормосны эд анги
                </Link>
              </li>
              <li>
                <Link
                  to="/products/suspension"
                  className="transition-colors hover:text-white"
                >
                  Түдгэлзүүлэлт
                </Link>
              </li>
              <li>
                <Link
                  to="/products/accessories"
                  className="transition-colors hover:text-white"
                >
                  Нэмэлт хэрэгсэл
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="transition-colors hover:text-white"
                >
                  Бүгдийг үзэх
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold md:mb-4 md:text-base">Холбоо барих</h3>
            <ul className="space-y-2 text-sm text-[#E5E7EB]">
              <li>Утас: +976 7777 7777</li>
              <li>Имэйл: info@autotech.mn</li>
              <li>Хаяг: Улаанбаатар, Монгол</li>
              <li className="pt-2">
                <div className="font-medium text-white">Ажлын цаг:</div>
                <div>Даваа-Баасан: 9:00 - 18:00</div>
                <div>Бямба: 10:00 - 16:00</div>
                <div>Ням: Амарна</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#374151] bg-[#1F1F1F]">
        <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-8 md:py-6">
          <p className="text-center text-sm text-[#E5E7EB]">
            © 2025 AutoTech.mn. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
}
