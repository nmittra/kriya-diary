import {
  Button,
  VStack,
  Box,
  useToast
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface CropPanelProps {
  image: {
    file: File
    preview: string
  }
  setEditedImage: (preview: string) => void
}

export function CropPanel({ image, setEditedImage }: CropPanelProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  })
  const [cropping, setCropping] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const toast = useToast()

  const handleCrop = async () => {
    try {
      if (!imgRef.current || !crop.width || !crop.height) return

      setCropping(true)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const scaleX = imgRef.current.naturalWidth / imgRef.current.width
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height

      canvas.width = crop.width * scaleX
      canvas.height = crop.height * scaleY

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      )

      const dataUrl = canvas.toDataURL(image.file.type)
      setEditedImage(dataUrl)
      toast({
        title: 'Image cropped',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    } catch (error) {
      console.error('Error cropping image:', error)
      toast({
        title: 'Error cropping image',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    } finally {
      setCropping(false)
    }
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box maxH="500px" overflow="auto">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={undefined}
        >
          <img
            ref={imgRef}
            src={image.preview}
            alt="Crop preview"
            style={{ maxWidth: '100%' }}
          />
        </ReactCrop>
      </Box>

      <Button
        colorScheme="blue"
        onClick={handleCrop}
        isLoading={cropping}
        loadingText="Cropping"
      >
        Crop Image
      </Button>
    </VStack>
  )
}