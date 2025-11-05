'use client';

import { useState } from 'react';
import { registerUser } from '@/components/users/userApi';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('رمز عبور و تایید رمز عبور یکسان نیستند!');
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser({
        UserName: username,
        Password: password,
      });

      alert(result.message || 'ثبت‌نام با موفقیت انجام شد ✅');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      alert(err.message || 'خطا در ثبت‌نام ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center mb-4">ثبت‌نام</h2>
        <form onSubmit={handleSignup}>
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
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              تایید رمز عبور
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full! p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>
      </div>
    </div>
  );
}
