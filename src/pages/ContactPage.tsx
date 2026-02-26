import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';

export function ContactPage() {
  const googleMapsUrl = 'https://maps.app.goo.gl/UNaxc4FgTp6suxBNA';
  const googleMapsEmbedUrl =
    'https://www.google.com/maps?q=47.9256239,106.9978558&z=17&output=embed';

  return (
    <div>
      {/* Contact Methods */}
      <div className="bg-[#FAFAFA] py-12">
        <div className="mx-auto max-w-[900px] px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 text-center shadow-lg">
              <Phone className="mx-auto mb-4 h-12 w-12 text-[#DC2626]" />
              <h3 className="mb-2 font-bold text-black">Phone</h3>
              <p className="text-[#374151]">97080808</p>
              <p className="text-sm text-[#6B7280]">Мягмар-Ням 10:00-18:00</p>
            </div>

            <div className="rounded-lg bg-white p-6 text-center shadow-lg">
              <Mail className="mx-auto mb-4 h-12 w-12 text-[#DC2626]" />
              <h3 className="mb-2 font-bold text-black">Email</h3>
              <p className="text-[#374151]">info@autotech.mn</p>
              <p className="text-sm text-[#6B7280]">24/7 support</p>
            </div>

            <div className="rounded-lg bg-white p-6 text-center shadow-lg">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-[#DC2626]" />
              <h3 className="mb-2 font-bold text-black">Location</h3>
              <p className="text-[#374151]">Ulaanbaatar</p>
              <p className="text-sm text-[#6B7280]">Mongolia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-[#FAFAFA] py-12">
        <div className="mx-auto max-w-[900px] px-8">
          <div className="overflow-hidden rounded-lg">
            <iframe
              title="AutoTech Location"
              src={googleMapsEmbedUrl}
              className="h-[500px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4 text-center">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-[#DC2626] px-4 py-2 text-sm font-medium text-white hover:bg-[#B91C1C]"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-[900px] px-8">
          <div className="rounded-lg bg-white p-8 text-center shadow-lg">
            <Clock className="mx-auto mb-4 h-12 w-12 text-[#DC2626]" />
            <h3 className="mb-6 text-[24px] font-bold text-black">
              Ажлын цаг
            </h3>
            <div className="space-y-2 text-[#374151]">
              <div className="flex justify-center gap-8">
                <span className="font-medium">Даваа:</span>
                <span>Амарна</span>
              </div>
              <div className="flex justify-center gap-8">
                <span className="font-medium">Мягмар - Ням:</span>
                <span>10:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}