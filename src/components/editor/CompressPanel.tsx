import {
  Button,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import imageCompression from 'browser-image-compression'

interface CompressPanelProps {
  image: {
    file: File
    preview: string
  }
  setEditedImage: (preview: string) => void
}

export function CompressPanel({ image, setEditedImage }: CompressPanelProps) {
  const [quality, setQuality] = useState(80)
  const [compressing, setCompressing] = useState(false)

  const handleCompress = async () => {
    try {
      setCompressing(true)
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality / 100,
      }

      const compressedFile = await imageCompression(image.file, options)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditedImage(reader.result)
        }
      }
      reader.readAsDataURL(compressedFile)
    } catch (error) {
      console.error('Error compressing image:', error)
    } finally {
      setCompressing(false)
    }
  }

  return (
    <VStack spacing={6} align="stretch" p={4}>
      <FormControl>
        <FormLabel fontWeight="medium">Compression Quality</FormLabel>
        <Box px={2}>
          <Text mb={2}>{quality}%</Text>
          <Slider
            value={quality}
            onChange={setQuality}
            min={1}
            max={100}
            step={1}
            colorScheme="blue"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
        </Box>
      </FormControl>

      <Button
        colorScheme="blue"
        size="lg"
        width="100%"
        borderRadius="md"
        onClick={handleCompress}
        isLoading={compressing}
        loadingText="Compressing"
      >
        Compress Image
      </Button>
    </VStack>
  )
}