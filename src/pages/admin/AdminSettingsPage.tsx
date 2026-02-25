import { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopBar } from '../../components/admin/AdminTopBar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export function AdminSettingsPage() {
  type SettingsState = {
    siteName: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    facebook: string;
    instagram: string;
    youtube: string;
    currency: string;
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    siteName: 'AutoTech.mn',
    tagline: 'Таны найдвартай автомашины эд ангийн түнш',
    phone: '+976 7777 7777',
    email: 'info@autotech.mn',
    address: 'Улаанбаатар, Монгол',
    facebook: 'https://facebook.com/autotech.mn',
    instagram: 'https://instagram.com/autotech.mn',
    youtube: '',
    currency: 'MNT',
  });
  const [initialSettings, setInitialSettings] = useState<SettingsState>(settings);
  const [saving, setSaving] = useState(false);
  const [logoFileName, setLogoFileName] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      if (!isSupabaseConfigured || !supabase) return;

      const { data, error } = await supabase
        .from('site_settings')
        .select('site_name, tagline, phone, email, address, facebook, instagram, youtube, currency')
        .eq('id', 1)
        .maybeSingle();

      if (error || !data || !mounted) {
        if (error) {
          console.error('Failed to load site settings:', error);
        }
        return;
      }

      const nextSettings: SettingsState = {
        siteName: data.site_name || '',
        tagline: data.tagline || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        youtube: data.youtube || '',
        currency: data.currency || 'MNT',
      };

      setSettings(nextSettings);
      setInitialSettings(nextSettings);
    };

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (!isSupabaseConfigured || !supabase) {
      alert('Supabase тохиргоо дутуу байна.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      site_name: settings.siteName,
      tagline: settings.tagline,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      facebook: settings.facebook,
      instagram: settings.instagram,
      youtube: settings.youtube,
      currency: settings.currency,
    });
    setSaving(false);

    if (error) {
      console.error('Failed to save site settings:', error);
      alert('Тохиргоо хадгалах үед алдаа гарлаа.');
      return;
    }

    setInitialSettings(settings);
    alert('Тохиргоо амжилттай хадгалагдлаа!');
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    setLogoFileName('');
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 lg:ml-[260px]">
        <AdminTopBar title="Тохиргоо" onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <Tabs defaultValue="general" className="space-y-4 lg:space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="general" className="text-xs lg:text-sm">Ерөнхий</TabsTrigger>
                <TabsTrigger value="contact" className="text-xs lg:text-sm">Холбоо барих</TabsTrigger>
                <TabsTrigger value="social" className="text-xs lg:text-sm">Сошиал медиа</TabsTrigger>
                <TabsTrigger value="business" className="text-xs lg:text-sm">Ажлын цаг</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-4 lg:space-y-6">
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 lg:mb-6 font-bold text-black">
                    Ерөнхий тохиргоо
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="siteName">Сайтын нэр</Label>
                      <Input
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) =>
                          setSettings({ ...settings, siteName: e.target.value })
                        }
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tagline">Уриа</Label>
                      <Input
                        id="tagline"
                        value={settings.tagline}
                        onChange={(e) =>
                          setSettings({ ...settings, tagline: e.target.value })
                        }
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>

                    <div>
                      <Label htmlFor="currency">Валют</Label>
                      <Input
                        id="currency"
                        value={settings.currency}
                        onChange={(e) =>
                          setSettings({ ...settings, currency: e.target.value })
                        }
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>

                    <div>
                      <Label htmlFor="logo">Логоны зураг</Label>
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => {
                            document.getElementById('logo-upload-input')?.click();
                          }}
                        >
                          Зураг оруулах
                        </Button>
                        <input
                          id="logo-upload-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setLogoFileName(file.name);
                          }}
                        />
                        {logoFileName && (
                          <p className="mt-2 text-xs text-[#6B7280]">
                            Сонгосон файл: {logoFileName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Contact Settings */}
              <TabsContent value="contact" className="space-y-4 lg:space-y-6">
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 lg:mb-6 font-bold text-black">
                    Холбоо барих мэдээлэл
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Утас</Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) =>
                          setSettings({ ...settings, phone: e.target.value })
                        }
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Имэйл</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) =>
                          setSettings({ ...settings, email: e.target.value })
                        }
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Хаяг</Label>
                      <Textarea
                        id="address"
                        rows={3}
                        value={settings.address}
                        onChange={(e) =>
                          setSettings({ ...settings, address: e.target.value })
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Social Media */}
              <TabsContent value="social" className="space-y-4 lg:space-y-6">
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 lg:mb-6 font-bold text-black">
                    Сошиал медиа холбоосууд
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={settings.facebook}
                        onChange={(e) =>
                          setSettings({ ...settings, facebook: e.target.value })
                        }
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>

                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={settings.instagram}
                        onChange={(e) =>
                          setSettings({ ...settings, instagram: e.target.value })
                        }
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>

                    <div>
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        value={settings.youtube}
                        onChange={(e) =>
                          setSettings({ ...settings, youtube: e.target.value })
                        }
                        placeholder="https://youtube.com/@autotech.mn"
                        className="mt-2 h-12 lg:h-14"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Business Hours */}
              <TabsContent value="business" className="space-y-4 lg:space-y-6">
                <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
                  <h2 className="mb-4 lg:mb-6 font-bold text-black">
                    Ажлын цаг
                  </h2>

                  <div className="space-y-3 lg:space-y-4">
                    {[
                      { day: 'Даваа - Баасан', hours: '9:00 - 18:00' },
                      { day: 'Бямба', hours: '10:00 - 16:00' },
                      { day: 'Ням', hours: 'Амарна' }
                    ].map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] p-3 lg:p-4">
                        <span className="font-medium text-sm lg:text-base">{schedule.day}</span>
                        <span className="text-[#6B7280] text-sm lg:text-base">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            <div className="sticky bottom-0 mt-4 lg:mt-6 rounded-lg bg-white p-3 lg:p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleCancel}
                >
                  Цуцлах
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] w-full sm:w-auto"
                >
                  {saving ? 'Хадгалж байна...' : 'Хадгалах'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}