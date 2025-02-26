import { Box, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

interface AdContainerProps {
  id: string;
  type: 'leaderboard' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

export const AdContainer = ({ id, type, className }: AdContainerProps) => {
  const bg = useColorModeValue('gray.50', 'gray.700');
  const border = useColorModeValue('gray.200', 'gray.600');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getAdDimensions = (type: string) => {
    switch (type) {
      case 'leaderboard':
        return { minHeight: '90px', width: '100%', maxWidth: '728px' };
      case 'sidebar':
        return { minHeight: '600px', width: '300px' };
      case 'in-content':
        return { minHeight: '250px', width: '100%' };
      case 'footer':
        return { minHeight: '90px', width: '100%', maxWidth: '728px' };
      default:
        return {};
    }
  };

  return (
    <Box
      ref={containerRef}
      id={id}
      className={`ad-container ${className || ''}`}
      bg={bg}
      border="2px solid"
      borderColor={border}
      borderRadius="lg"
      p={4}
      my={6}
      mx="auto"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      _before={{
        content: '"Advertisement"',
        position: 'absolute',
        top: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        bg: bg,
        px: 2,
        fontSize: 'xs',
        color: 'gray.500',
        fontWeight: 'medium',
      }}
      {...getAdDimensions(type)}
      role="complementary"
      aria-label="Advertisement"
    >
      {isVisible ? (
        <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
          {/* Ad code will be inserted here */}
        </Box>
      ) : (
        <Box as="span" color="gray.500" fontSize="sm">
          Loading advertisement...
        </Box>
      )}
    </Box>
  );
};