'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { clientTripService } from '@/services/tripService.client';
import { TripDocument } from '@/types/trip';

interface NextTripLinkProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function NextTripLink({ className, children, onClick }: NextTripLinkProps) {
  const [nextTrip, setNextTrip] = useState<TripDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNextTrip = async () => {
      try {
        const trip = await clientTripService.getNextTrip();
        setNextTrip(trip);
      } catch (error) {
        console.error('Error fetching next trip:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNextTrip();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick();
    }

    if (isLoading) {
      // If still loading, redirect to homepage as fallback
      router.push('/');
      return;
    }

    if (nextTrip) {
      // Redirect to the specific trip page
      router.push(`/trip/${nextTrip.$id}`);
    } else {
      // If no next trip found, redirect to homepage
      router.push('/');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={className}
      style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
    >
      {children || (
        <button
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Compass size={16} />
          Next Trip
        </button>
      )}
    </div>
  );
}
