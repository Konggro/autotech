import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../lib/auth-context';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) return;
    navigate(isAdmin ? '/admin/dashboard' : '/');
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    
    if (!success) {
      setError('Имэйл эсвэл нууц үг буруу байна');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <span className="text-[32px] font-bold text-black">AutoTech</span>
            <span className="text-[32px] font-bold text-[#DC2626]">.mn</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-black">Нэвтрэх</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Өөрийн бүртгэлээр нэвтэрнэ үү
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Имэйл хаяг</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2"
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C]"
              disabled={loading}
            >
              {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Бүртгэлгүй юу?{' '}
              <Link
                to="/register"
                className="font-medium text-[#DC2626] hover:text-[#B91C1C]"
              >
                Бүртгүүлэх
              </Link>
            </p>
          </div>

        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-[#6B7280] hover:text-[#DC2626]"
          >
            ← Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
