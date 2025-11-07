'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasPermission } from '@/lib/auth-client';

export default function RequirePermission({ code, children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const ok = hasPermission(code);
    if (!ok) {
      router.replace('/unauthorized');
    } else {
      setAllowed(true);
    }
    setReady(true);
  }, [code, router]);

  if (!ready) return null;
  if (!allowed) return null;

  return <>{children}</>;
}
