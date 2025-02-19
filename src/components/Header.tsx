import { Box, Container, HStack, Link as ChakraLink, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

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
        <HStack spacing={8} justify="center">
          <ChakraLink
            as={Link}
            to="/"
            fontWeight="bold"
            fontSize="lg"
            color="blue.500"
            _hover={{ textDecoration: 'none', color: 'blue.600' }}
          >
            Home
          </ChakraLink>
          <ChakraLink
            as={Link}
            to="/compress"
            _hover={{ textDecoration: 'none', color: 'blue.500' }}
          >
            Compress
          </ChakraLink>
          <ChakraLink
            as={Link}
            to="/resize"
            _hover={{ textDecoration: 'none', color: 'blue.500' }}
          >
            Resize
          </ChakraLink>
          <ChakraLink
            as={Link}
            to="/watermark"
            _hover={{ textDecoration: 'none', color: 'blue.500' }}
          >
            Watermark
          </ChakraLink>
          <ChakraLink
            as={Link}
            to="/editor"
            _hover={{ textDecoration: 'none', color: 'blue.500' }}
          >
            Editor
          </ChakraLink>
        </HStack>
      </Container>
    </Box>
  )
}