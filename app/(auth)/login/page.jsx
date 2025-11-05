'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loginUser } from '@/components/users/userApi';

const TOKEN_KEY = 'access_token'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await loginUser({
        UserName: username,
        Password: password,
      });
      console.log(result);
      const token = result?.token;
      if (!token) throw new Error('توکن دریافت نشد');

      localStorage.setItem(TOKEN_KEY, token);
      window.location.href = '/'; 
    } catch (err) {
      console.error('❌ Login Error:', err);
      alert(err.message || 'خطا در ورود به سیستم');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center mb-4">ورود به سیستم</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full! p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              رمز عبور
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full! p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          هنوز حساب کاربری ندارید؟{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
