import {
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'

interface ConvertPanelProps {
  image: {
    file: File
    preview: string
  }
  setEditedImage: (preview: string) => void
}

export function ConvertPanel({ image, setEditedImage }: ConvertPanelProps) {
  const [format, setFormat] = useState('image/jpeg')
  const [converting, setConverting] = useState(false)

  const handleConvert = async () => {
    try {
      setConverting(true)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const quality = format === 'image/jpeg' || format === 'image/webp' ? 0.92 : undefined
        const dataUrl = canvas.toDataURL(format, quality)
        setEditedImage(dataUrl)
        setConverting(false)
      }
      img.src = image.preview
    } catch (error) {
      console.error('Error converting image:', error)
      setConverting(false)
    }
  }

  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>Convert to Format</FormLabel>
        <Select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="image/jpeg">JPEG</option>
          <option value="image/png">PNG</option>
          <option value="image/webp">WebP</option>
        </Select>
      </FormControl>

      <Text fontSize="sm" color="gray.500">
        Current format: {image.file.type}
      </Text>

      <Button
        colorScheme="blue"
        onClick={handleConvert}
        isLoading={converting}
        loadingText="Converting"
      >
        Convert Image
      </Button>
    </VStack>
  )
}