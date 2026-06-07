'use client'

export default function imageLoader({ src }: { src: string }) {
  if (src.startsWith('/api/public/image/')) {
    const key = src.replace('/api/public/image/', '');
    const r2Url = process.env.NEXT_PUBLIC_R2_URL;
    if (r2Url) {
      return `${r2Url}/${key}`;
    }
  }
  
  return src;
}
