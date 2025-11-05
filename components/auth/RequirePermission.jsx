'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasPermission } from '@/lib/auth-client';

export default function RequirePermission({ code, children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const ok = hasPermission(code);
    if (!ok) {
      router.replace('/unauthorized');
    } else {
      setAllowed(true);
    }
  }, [code, router]);

  if (allowed === null) return null; 
  return <>{children}</>;
}
