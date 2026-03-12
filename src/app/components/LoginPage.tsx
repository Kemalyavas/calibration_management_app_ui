import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Disc } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { setUserRole } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Kullanıcı kontrolü
    if (username === 'operator' && password === 'asdfgh123') {
      setUserRole('operator');
      navigate('/dashboard');
    } else if (username === 'manager' && password === 'asdfgh456') {
      setUserRole('manager');
      navigate('/dashboard');
    } else {
      setError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  const handleGuestLogin = () => {
    setUserRole('guest');
    navigate('/guest-dashboard');
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1564901523975-b18a3eb1d11f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJuaWVyJTIwY2FsaXBlciUyMG1lYXN1cmVtZW50JTIwcHJlY2lzaW9uJTIwdG9vbHxlbnwxfHx8fDE3NzE0MDYxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 bg-[#1F2A44] text-white px-6 py-3 rounded-lg mb-4">
              <Disc className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">PROMETEON</h1>
                <p className="text-sm opacity-90">TURKEY</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#1F2A44] mt-4">
              KALİBRASYON SİSTEMİ
            </h2>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Kullanıcı Adı</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-14 text-lg bg-gray-50 border-gray-300 rounded-xl"
                placeholder="Kullanıcı adını girin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 text-lg bg-gray-50 border-gray-300 rounded-xl"
                placeholder="Şifrenizi girin"
                required
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full h-14 text-lg bg-[#1F2A44] hover:bg-[#2d3d5f] rounded-xl"
              >
                Giriş Yap
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGuestLogin}
                className="w-full h-14 text-lg border-2 border-[#1F2A44] text-[#1F2A44] hover:bg-[#1F2A44] hover:text-white rounded-xl"
              >
                Misafir Girişi
              </Button>
            </div>
          </form>

          {/* Yardım metni */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Operator: operator / asdfgh123</p>
            <p>Manager: manager / asdfgh456</p>
          </div>
        </div>
      </div>
    </div>
  );
}