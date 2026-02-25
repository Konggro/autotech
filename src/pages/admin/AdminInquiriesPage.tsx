import { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopBar } from '../../components/admin/AdminTopBar';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Eye, Mail, Phone } from 'lucide-react';
import {
  fetchAdminInquiries,
  updateInquiryStatus,
  type Inquiry,
  type InquiryStatus,
} from '../../lib/data-service';

export function AdminInquiriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadInquiries = async () => {
      const data = await fetchAdminInquiries();
      if (!mounted) return;
      setInquiries(data);
      setLoading(false);
    };

    loadInquiries();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredInquiries = statusFilter === 'all'
    ? inquiries
    : inquiries.filter(i => i.status === statusFilter);

  const statusColors = {
    new: 'bg-[#DC2626] text-white',
    'in-progress': 'bg-[#F59E0B] text-white',
    completed: 'bg-[#10B981] text-white'
  };

  const statusLabels = {
    new: 'Шинэ',
    'in-progress': 'Хариулж байгаа',
    completed: 'Хаасан'
  };

  const handleStatusChange = async (status: InquiryStatus) => {
    if (!selectedInquiry) return;
    const success = await updateInquiryStatus(selectedInquiry.id, status);
    if (!success) return;

    setInquiries((prev) =>
      prev.map((item) =>
        item.id === selectedInquiry.id ? { ...item, status } : item,
      ),
    );
    setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
  };

  const handleSendEmail = () => {
    if (!selectedInquiry?.email) return;
    const subject = encodeURIComponent(`AutoTech.mn: ${selectedInquiry.subject}`);
    const body = encodeURIComponent(
      `Сайн байна уу ${selectedInquiry.customerName},\n\nТаны илгээсэн лавлагаанд хариу илгээж байна.\n\n`,
    );
    window.location.href = `mailto:${selectedInquiry.email}?subject=${subject}&body=${body}`;
  };

  const handleCall = () => {
    if (!selectedInquiry?.phone) return;
    const phone = selectedInquiry.phone.replace(/\s+/g, '');
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 lg:ml-[260px]">
        <AdminTopBar title="Хэрэглэгчийн лавлагаа" onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-8">
          {/* Status Tabs */}
          <div className="mb-4 lg:mb-6 flex flex-wrap gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Бүгд
            </Button>
            <Button
              variant={statusFilter === 'new' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('new')}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Шинэ
            </Button>
            <Button
              variant={statusFilter === 'in-progress' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('in-progress')}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Хариулж байгаа
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('completed')}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Хаасан
            </Button>
          </div>

          {/* Inquiries Table */}
          <div className="rounded-lg bg-white shadow-sm">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full lg:w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Төлөв
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Хэрэглэгч
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap hidden md:table-cell">
                        Холбоо барих
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Сэдэв
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap hidden lg:table-cell">
                        Бүтээгдэхүүн
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap hidden sm:table-cell">
                        Огноо
                      </th>
                      <th className="p-2 lg:p-4 text-left text-xs lg:text-sm font-medium text-[#6B7280] whitespace-nowrap">
                        Үйлдэл
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-sm text-[#6B7280]">
                          Уншиж байна...
                        </td>
                      </tr>
                    )}
                    {filteredInquiries.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                      >
                        <td className="p-2 lg:p-4">
                          <Badge className={statusColors[inquiry.status]}>
                            {statusLabels[inquiry.status]}
                          </Badge>
                        </td>
                        <td className="p-2 lg:p-4">
                          <div className="font-medium text-black text-sm lg:text-base">
                            {inquiry.customerName}
                          </div>
                          <div className="text-xs text-[#6B7280] md:hidden">
                            {inquiry.phone}
                          </div>
                        </td>
                        <td className="p-2 lg:p-4 text-xs lg:text-sm text-[#374151] hidden md:table-cell">
                          <div>{inquiry.email}</div>
                          <div>{inquiry.phone}</div>
                        </td>
                        <td className="p-2 lg:p-4 text-[#374151] text-sm lg:text-base">
                          <div className="max-w-[150px] lg:max-w-none truncate">{inquiry.subject}</div>
                        </td>
                        <td className="p-2 lg:p-4 text-xs lg:text-sm text-[#6B7280] hidden lg:table-cell">
                          {inquiry.product || '-'}
                        </td>
                        <td className="p-2 lg:p-4 text-xs lg:text-sm text-[#6B7280] hidden sm:table-cell">
                          {inquiry.date}
                        </td>
                        <td className="p-2 lg:p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="h-8 lg:h-9"
                          >
                            <Eye className="mr-0 lg:mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Үзэх</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Лавлагааны дэлгэрэнгүй</DialogTitle>
            <DialogDescription>
              {selectedInquiry ? `ID: ${selectedInquiry.id}` : 'Лавлагааны мэдээлэл'}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium text-black">
                  Хэрэглэгчийн мэдээлэл
                </h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-[#6B7280]">Нэр:</span> {selectedInquiry.customerName}</p>
                  <p><span className="text-[#6B7280]">Имэйл:</span> {selectedInquiry.email}</p>
                  <p><span className="text-[#6B7280]">Утас:</span> {selectedInquiry.phone}</p>
                  <p><span className="text-[#6B7280]">Огноо:</span> {selectedInquiry.date}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-black">Сэдэв</h4>
                <p className="text-sm">{selectedInquiry.subject}</p>
              </div>

              {selectedInquiry.product && (
                <div>
                  <h4 className="mb-2 font-medium text-black">Сонирхож буй бүтээгдэхүүн</h4>
                  <p className="text-sm">{selectedInquiry.product}</p>
                </div>
              )}

              <div>
                <h4 className="mb-2 font-medium text-black">Мессеж</h4>
                <p className="rounded-lg bg-[#F9FAFB] p-4 text-sm">
                  {selectedInquiry.message}
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-black">Төлөв</h4>
                <Badge className={statusColors[selectedInquiry.status]}>
                  {statusLabels[selectedInquiry.status]}
                </Badge>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange('new')}
                  >
                    Шинэ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange('in-progress')}
                  >
                    Хариулж байгаа
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange('completed')}
                  >
                    Хаасан
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={handleSendEmail} disabled={!selectedInquiry.email}>
                  <Mail className="mr-2 h-4 w-4" />
                  Имэйл илгээх
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCall}
                  disabled={!selectedInquiry.phone}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Залгах
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}