import { Box, Container, Heading, VStack, useColorModeValue } from '@chakra-ui/react'
import { ImageUploader } from '../components/ImageUploader'
import { ImageEditor } from '../components/ImageEditor'
import { useOutletContext } from 'react-router-dom'
import { Header } from '../components/Header'

interface ImageFile {
  file: File
  preview: string
}

type ImageContext = [ImageFile | null, (image: ImageFile | null) => void]

function MemePage() {
  const [selectedImage, setSelectedImage] = useOutletContext<ImageContext>()
  const bg = useColorModeValue('gray.50', 'gray.800')

  return (
    <Box bg={bg} minH="100vh">
      <Header />
      <Box py={12}>
        <Container maxW="container.lg">
          <VStack spacing={8} align="center" w="full">
            <Heading as="h1" size="xl" textAlign="center" mb={4}>
              Create Your Memes
            </Heading>
            {!selectedImage ? (
              <ImageUploader setSelectedImage={setSelectedImage} />
            ) : (
              <ImageEditor
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                defaultTab="meme"
              />
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default MemePage