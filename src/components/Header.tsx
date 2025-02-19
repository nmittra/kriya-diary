import { Box, Container, HStack, Link as ChakraLink, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function Header() {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

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
      <Container maxW="container.xl" py={4}>
        <HStack spacing={8} justify="space-between">
          <ChakraLink
            as={Link}
            to="/"
            display="flex"
            alignItems="center"
            _hover={{ textDecoration: 'none' }}
          >
            <Logo />
          </ChakraLink>
          <HStack spacing={8} flex={1} justify="center">
            <ChakraLink
              as={Link}
              to="/compress"
              _hover={{ textDecoration: 'none', color: 'blue.500' }}
              fontSize="md"
            >
              Compress
            </ChakraLink>
            <ChakraLink
              as={Link}
              to="/resize"
              _hover={{ textDecoration: 'none', color: 'blue.500' }}
              fontSize="md"
            >
              Resize
            </ChakraLink>
            <ChakraLink
              as={Link}
              to="/watermark"
              _hover={{ textDecoration: 'none', color: 'blue.500' }}
              fontSize="md"
            >
              Watermark
            </ChakraLink>
            <ChakraLink
              as={Link}
              to="/editor/crop"
              _hover={{ textDecoration: 'none', color: 'blue.500' }}
              fontSize="md"
            >
              Crop
            </ChakraLink>
            <ChakraLink
              as={Link}
              to="/editor/convert"
              _hover={{ textDecoration: 'none', color: 'blue.500' }}
              fontSize="md"
            >
              Convert
            </ChakraLink>
            <ChakraLink
              as={Link}
              to="/editor/meme"
              _hover={{ textDecoration: 'none', color: 'blue.500' }}
              fontSize="md"
            >
              Meme
            </ChakraLink>
            <ChakraLink
              as={Link}
              to="/editor/main"
              _hover={{ textDecoration: 'none', color: 'blue.500' }}
              fontSize="md"
            >
              Editor
            </ChakraLink>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}