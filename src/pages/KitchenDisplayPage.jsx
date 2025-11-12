/**
 * Kitchen Display Page
 *
 * Full-screen kitchen display system page
 */

import { useEffect } from 'react';
import KitchenDisplay from '@/features/kitchen-display/components/KitchenDisplay';

/**
 * Kitchen Display Page Component
 */
const KitchenDisplayPage = () => {
  useEffect(() => {
    // Request fullscreen on mount (optional)
    const requestFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log('Fullscreen request failed:', err);
        });
      }
    };

    // Uncomment to enable auto-fullscreen
    // requestFullscreen();

    // Prevent accidental page close
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <KitchenDisplay />
    </div>
  );
};

export default KitchenDisplayPage;
