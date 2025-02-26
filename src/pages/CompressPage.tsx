import { Box, Container, Heading, VStack, useColorModeValue } from '@chakra-ui/react'
import { ImageUploader } from '../components/ImageUploader'
import { ImageEditor } from '../components/ImageEditor'
import { useState } from 'react'
import { Header } from '../components/Header'

interface ImageFile {
  file: File
  preview: string
}

export default CompressPage

function CompressPage() {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)
  const bg = useColorModeValue('gray.50', 'gray.800')

  return (
    <Box bg={bg} minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box py={8} flex="1">
        <Container maxW="container.xl" h="100%" display="flex" flexDirection="column">
          <VStack spacing={8} flex="1" w="100%" visibility="visible" opacity={1}>
            <Heading as="h1" size="xl" textAlign="center" mb={4}>
              Compress Your Images
            </Heading>
            {!selectedImage ? (
              <ImageUploader setSelectedImage={setSelectedImage} />
            ) : (
              <ImageEditor
                selectedImage={selectedImage}

export default CompressPage
                setSelectedImage={setSelectedImage}

export default CompressPage
                defaultTab="compress"
              />
            )}

export default CompressPage
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}