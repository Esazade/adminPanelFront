'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // این قسمت باعث می‌شود که کد در سمت کلاینت اجرا شود
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('نام کاربری:', username);
    console.log('رمز عبور:', password);
  };

  if (!isClient) {
    return null; // در حالت سرور هیچ چیزی نمایش داده نمی‌شود
  }

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
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            ورود
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          هنوز حساب کاربری ندارید؟ <Link href="/register" className="text-blue-500">ثبت‌نام کنید</Link>
        </p>
      </div>
    </div>
  );
}
