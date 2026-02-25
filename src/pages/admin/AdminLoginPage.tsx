import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (email === 'admin@autotech.mn' && password === 'admin') {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-4">
      <div className="w-full max-w-[450px] rounded-lg bg-white p-12 shadow-lg">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="mb-6 flex items-center justify-center">
            <span className="text-[32px] font-bold text-black">AutoTech</span>
            <span className="text-[32px] font-bold text-[#DC2626]">.mn</span>
          </div>
          <h1 className="text-[28px] font-bold text-black">Admin Login</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-md bg-[#FEE2E2] p-3 text-[#DC2626]">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email or Username</Label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-10"
                placeholder="admin@autotech.mn"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 pl-10 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="remember"
                className="cursor-pointer text-sm font-normal"
              >
                Remember me
              </Label>
            </div>
            <a href="#" className="text-sm text-[#DC2626] hover:underline">
              Forgot Password?
            </a>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-[#DC2626] py-7 font-bold hover:bg-[#B91C1C]"
          >
            Sign In
          </Button>
        </form>

        {/* Security Notice */}
        <p className="mt-6 text-center text-xs text-[#6B7280]">
          Admin access only. All login attempts are logged.
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-md bg-[#F3F4F6] p-3 text-xs text-[#6B7280]">
          <p className="font-medium text-black">Demo Credentials:</p>
          <p>Email: admin@autotech.mn</p>
          <p>Password: admin</p>
        </div>
      </div>
    </div>
  );
}