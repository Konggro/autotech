import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function ContactPage() {
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('');

    if (!isSupabaseConfigured || !supabase) {
      setNotice('Supabase тохиргоо дутуу байна.');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('inquiries').insert({
      customer_name: form.customerName,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject,
      message: form.message,
    });
    setSubmitting(false);

    if (error) {
      console.error('Failed to submit inquiry:', error);
      setNotice('Илгээх үед алдаа гарлаа. Дахин оролдоно уу.');
      return;
    }

    setNotice('Амжилттай илгээгдлээ. Бид тантай удахгүй холбогдоно.');
    setForm({
      customerName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-[900px] px-8 text-center">
          <h1 className="mb-4 text-[48px] font-bold text-black">Contact Us</h1>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="bg-[#FAFAFA] py-12">
        <div className="mx-auto max-w-[900px] px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 text-center shadow-lg">
              <Phone className="mx-auto mb-4 h-12 w-12 text-[#DC2626]" />
              <h3 className="mb-2 font-bold text-black">Phone</h3>
              <p className="text-[#374151]">+976 7777 7777</p>
              <p className="text-sm text-[#6B7280]">Mon-Fri 9am-6pm</p>
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

      {/* Business Hours */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-[900px] px-8">
          <div className="rounded-lg bg-white p-8 text-center shadow-lg">
            <Clock className="mx-auto mb-4 h-12 w-12 text-[#DC2626]" />
            <h3 className="mb-6 text-[24px] font-bold text-black">
              Business Hours
            </h3>
            <div className="space-y-2 text-[#374151]">
              <div className="flex justify-center gap-8">
                <span className="font-medium">Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-center gap-8">
                <span className="font-medium">Saturday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-center gap-8">
                <span className="font-medium">Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-[900px] px-8">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-[24px] font-bold text-black">Мессеж илгээх</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="customerName">Нэр</Label>
                <Input
                  id="customerName"
                  value={form.customerName}
                  onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
                  required
                  className="mt-2"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="email">Имэйл</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Утас</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Сэдэв</Label>
                <Input
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="message">Мессеж</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  required
                  className="mt-2"
                />
              </div>
              {notice && <p className="text-sm text-[#6B7280]">{notice}</p>}
              <Button
                type="submit"
                className="w-full bg-[#DC2626] hover:bg-[#B91C1C]"
                disabled={submitting}
              >
                {submitting ? 'Илгээж байна...' : 'Илгээх'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-[#FAFAFA] py-12">
        <div className="mx-auto max-w-[900px] px-8">
          <div className="overflow-hidden rounded-lg">
            <div className="h-[500px] bg-[#E5E7EB] flex items-center justify-center">
              <p className="text-[#6B7280]">Map integration placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}