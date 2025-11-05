import { cookies } from 'next/headers';


const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };

export async function checkPermission(requiredPermission) { 
     const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;     
    
    console.log('🔐 Token from cookies:', token );

    const res = await fetch(`${API}/user/me?permission=${requiredPermission}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Cookie': `token=${token}`
        },
        credentials: 'include', 
    });
    console.log('res', res);
    if (!res.ok) return false;

    const data = await res.json();
    console.log('Permission check result:', data);
    return data.hasPermission;
}
