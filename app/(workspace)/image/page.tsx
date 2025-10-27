'use client';

import { useRouter } from 'next/navigation';
import ImageTab from '@/components/tabs/ImageTab';

export default function ImagePage() {
  const router = useRouter();

  const handleGCodeGenerated = (gcode: string) => {
    sessionStorage.setItem('generated-gcode', gcode);
    router.push('/gcode');
  };

  return (
    <div className="ribbon-tab-content">
      <ImageTab onGCodeGenerated={handleGCodeGenerated} />
    </div>
  );
}
