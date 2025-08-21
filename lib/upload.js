
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000';

export async function uploadFile(file, opts = {}) {
  const { folder = 'misc', maxSizeMB, acceptMimePrefix, signal } = opts;

  if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`حجم فایل نباید بیشتر از ${maxSizeMB}MB باشد`);
  }
  if (acceptMimePrefix && !file.type.startsWith(acceptMimePrefix)) {
    throw new Error(`نوع فایل مجاز نیست (${acceptMimePrefix}*)`);
  }

  const fd = new FormData();
  fd.append('file', file);

  const res = await fetch(`${API_BASE}/upload?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    body: fd,
    signal,
  });

  if (!res.ok) throw new Error(await res.text() || 'Upload failed');
  return res.json(); // { url, fileName, folder }
}
