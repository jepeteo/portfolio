
import React, { useCallback } from 'react';
export const useViewTransition = () => {
  const isSupported = React.useMemo(() => {
    return typeof window !== 'undefined' && 'startViewTransition' in document;
  }, []);

  const startTransition = useCallback((updateCallback: () => void | Promise<void>) => {
    if (isSupported) {
      document.startViewTransition(updateCallback);
    } else {
      updateCallback();
    }
  }, [isSupported]);

  return { startTransition, isSupported };
};
interface ViewTransitionProps {
  children: React.ReactNode;
  name?: string;
  onTransition?: () => void;
}

export const ViewTransition: React.FC<ViewTransitionProps> = ({ 
  children, 
  name,
  onTransition 
}) => {
  const { startTransition } = useViewTransition();
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (onTransition) {
      e.preventDefault();
      startTransition(onTransition);
    }
  }, [startTransition, onTransition]);

  return (
    <div
      style={{ viewTransitionName: name }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
export const viewTransitionStyles = `
  
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.5s;
  }

  ::view-transition-old(hero-image) {
    animation: slide-out-to-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  ::view-transition-new(hero-image) {
    animation: slide-in-from-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  ::view-transition-old(card) {
    animation: scale-down 0.3s ease-out;
  }

  ::view-transition-new(card) {
    animation: scale-up 0.3s ease-out;
  }

  @keyframes slide-out-to-left {
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }

  @keyframes slide-in-from-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes scale-down {
    to {
      transform: scale(0.9);
      opacity: 0;
    }
  }

  @keyframes scale-up {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
  }
`;
interface PageTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  transitionKey 
}) => {
  const { startTransition, isSupported } = useViewTransition();
  
  React.useEffect(() => {
    if (isSupported) {
      startTransition(() => {
      });
    }
  }, [transitionKey, startTransition, isSupported]);

  return (
    <div style={{ viewTransitionName: 'page-content' }}>
      {children}
    </div>
  );
};

export default useViewTransition;
