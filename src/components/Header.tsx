import { 
  Box, Container, HStack, Link as ChakraLink, useColorModeValue, IconButton, VStack, Collapse, 
  useDisclosure, Menu, MenuButton, MenuList, MenuItem, Button, useBreakpointValue, Text
} from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useMemo, useState, useEffect } from 'react'

interface NavItem {
  path: string
  label: string
}

interface NavLinkProps extends NavItem {
  isActive: boolean
  activeColor: string
  hoverBg?: string
  isMobile?: boolean
}

const NavLink = ({ path, label, isActive, activeColor, hoverBg, isMobile = false }: NavLinkProps) => (
  <ChakraLink
    key={path}
    as={Link}
    to={path}
    fontSize="md"
    fontWeight={isActive ? 'bold' : 'normal'}
    color={isActive ? activeColor : undefined}
    position="relative"
    _hover={{
      textDecoration: 'none',
      color: activeColor,
      ...(isMobile && { bg: hoverBg })
    }}
    _focus={{ boxShadow: 'outline', borderRadius: 'md' }}
    px={isMobile ? 4 : 3}
    py={2}
    borderRadius="md"
    aria-current={isActive ? 'page' : undefined}
    _after={!isMobile && isActive ? {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      height: '2px',
      bg: activeColor,
    } : {}}
  >
    {label}
  </ChakraLink>
)

export function Header() {
  // Define navigation items and their categories first
  const navCategories = useMemo(() => [
    { 
      title: 'Image Editing',
      items: ['/compress', '/resize', '/watermark', '/crop']
    },
    { 
      title: 'Format Tools',
      items: ['/convert', '/meme', '/editor'] 
    }
  ], []);

  const navItems = useMemo(() => [
    { path: '/compress', label: 'Compress' },
    { path: '/resize', label: 'Resize' },
    { path: '/watermark', label: 'Watermark' },
    { path: '/crop', label: 'Crop' },
    { path: '/convert', label: 'Convert' },
    { path: '/meme', label: 'Meme' },
    { path: '/editor', label: 'Editor' }
  ], []);

  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const activeColor = useColorModeValue('blue.500', 'blue.300')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const { isOpen, onToggle } = useDisclosure()
  const location = useLocation()
  const isMediumScreen = useBreakpointValue({ base: false, md: true, lg: false })

  // Track recently used tools
  const [recentTools, setRecentTools] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentTools');
    return saved ? JSON.parse(saved) : [];
  });

  // Update when navigating to a tool
  useEffect(() => {
    const currentPath = location.pathname;
    if (navItems.some(item => item.path === currentPath)) {
      const saved = localStorage.getItem('recentTools');
      const currentRecent = saved ? JSON.parse(saved) : [];
      
      const newRecent = [
        currentPath,
        ...currentRecent.filter(path => path !== currentPath)
      ].slice(0, 3); // Keep only 3 most recent
      
      setRecentTools(newRecent);
      localStorage.setItem('recentTools', JSON.stringify(newRecent));
    }
  }, [location.pathname, navItems]);



  const isActive = useMemo(() => (path: string) => {
    // Check for exact match first
    if (path === location.pathname) return true;
    
    // Handle special cases - ensure we don't match partial paths incorrectly
    // e.g. '/crop' should not match '/crop-advanced'
    const pathParts = path.split('/').filter(Boolean);
    const locationParts = location.pathname.split('/').filter(Boolean);
    
    if (pathParts.length === 0) return locationParts.length === 0;
    
    // Check if exact path segment matches, not just prefix
    return locationParts[0] === pathParts[0];
  }, [location.pathname]);

  // Skip to content link for accessibility
  const SkipLink = () => (
    <ChakraLink 
      href="#main-content" 
      position="absolute" 
      left="-9999px" 
      top="auto" 
      width="1px" 
      height="1px" 
      overflow="hidden"
      _focus={{ 
        left: "50%", 
        transform: "translateX(-50%)",
        width: "auto", 
        height: "auto",
        backgroundColor: "blue.100",
        padding: "1rem",
        zIndex: "1001"
      }}
    >
      Skip to main content
    </ChakraLink>
  );

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={1000}
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <SkipLink />
      <Container maxW="container.xl" py={4}>
        <HStack spacing={8} justify="space-between">
          <ChakraLink
            as={Link}
            to="/"
            display="flex"
            alignItems="center"
            _hover={{ textDecoration: 'none' }}
            aria-label="Home"
          >
            <Logo boxSize="40px" />
          </ChakraLink>

          {/* Desktop Navigation */}
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            {navItems.map((item) => (
              <ChakraLink
                key={item.path}
                as={Link}
                to={item.path}
                px={3}
                py={2}
                rounded="md"
                fontSize="sm"
                fontWeight="medium"
                color={isActive(item.path) ? activeColor : 'inherit'}
                bg={isActive(item.path) ? hoverBg : 'transparent'}
                _hover={{
                  textDecoration: 'none',
                  bg: hoverBg,
                }}
                onClick={(e) => handleNavClick(item.path, e)}
              >
                {item.label}
              </ChakraLink>
            ))}
          </HStack>

          {/* Mobile Navigation Toggle */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </HStack>

        {/* Mobile Navigation Menu */}
        <Collapse in={isOpen} animateOpacity>
          <VStack
            display={{ base: 'flex', md: 'none' }}
            mt={4}
            pb={4}
            spacing={2}
            align="stretch"
          >
            {navItems.map((item) => (
              <ChakraLink
                key={item.path}
                as={Link}
                to={item.path}
                px={3}
                py={2}
                rounded="md"
                fontSize="sm"
                fontWeight="medium"
                color={isActive(item.path) ? activeColor : 'inherit'}
                bg={isActive(item.path) ? hoverBg : 'transparent'}
                _hover={{
                  textDecoration: 'none',
                  bg: hoverBg,
                }}
                onClick={(e) => {
                  handleNavClick(item.path, e)
                  onToggle() // Close mobile menu after navigation
                }}
              >
                {item.label}
              </ChakraLink>
            ))}
          </VStack>
        </Collapse>
      </Container>
    </Box>
  )
}