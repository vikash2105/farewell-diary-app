/**
 * FloatingActionButton Component
 * Floating "+" button to create new diary
 */

import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/create')}
      className="
        fixed bottom-8 right-8
        w-16 h-16
        bg-primary
        text-primary-foreground
        rounded-full
        shadow-2xl
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110 hover:rotate-90
        active:scale-95
        z-50
        group
      "
      aria-label="Create new diary"
    >
      <Plus className="w-8 h-8" />
      
      {/* Tooltip */}
      <div className="
        absolute bottom-full right-0 mb-2
        bg-foreground text-background text-sm
        px-3 py-2 rounded-lg
        whitespace-nowrap
        opacity-0 group-hover:opacity-100
        pointer-events-none
        transition-opacity duration-200
      ">
        Create New Diary
      </div>
      
      {/* Ripple effect on hover */}
      <div className="
        absolute inset-0 rounded-full
        bg-primary opacity-0
        group-hover:opacity-20
        animate-ping
      " />
    </button>
  );
}
