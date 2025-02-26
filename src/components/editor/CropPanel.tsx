import {
  Button,
  VStack,
  Box,
  useToast,
  ButtonGroup,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb
} from '@chakra-ui/react'
import { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface CropPanelProps {
  image: {
    file: File
    preview: string
  }
  setEditedImage: (preview: string) => void
}

const aspectRatios = {
  none: undefined,
  square: 1,
  landscape: 16/9,
  portrait: 3/4
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
  const [quality, setQuality] = useState(0.92)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const toast = useToast()

  const handleCrop = useCallback(async () => {
      try {
        if (!imgRef.current || !crop.width || !crop.height) {
          toast({
            title: 'Invalid crop selection',
            description: 'Please select an area to crop',
            status: 'warning',
            duration: 2000,
            isClosable: true
          });
          return;
        }
    
        setCropping(true)
        const img = new Image()
        let isMounted = true

        img.onerror = () => {
          if (!isMounted) return
          setCropping(false)
          toast({
            title: 'Error loading image',
            description: 'The image could not be loaded. Please try again or use a different image.',
            status: 'error',
            duration: 2000,
            isClosable: true
          })
        }
        const resizeImageIfNeeded = (img: HTMLImageElement, maxWidth = 1920, maxHeight = 1080) => {
          if (img.width <= maxWidth && img.height <= maxHeight) return img;
          
          const canvas = document.createElement('canvas');
          const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
          
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return img;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const resizedImg = new Image();
          resizedImg.src = canvas.toDataURL();
          return resizedImg;
        };
        img.onload = () => {
          if (!isMounted) return
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
    
          // Resize large images before cropping
          const optimizedImg = resizeImageIfNeeded(imgRef.current);
          
          const scaleX = optimizedImg.naturalWidth / optimizedImg.width;
          const scaleY = optimizedImg.naturalHeight / optimizedImg.height;
    
          canvas.width = crop.width * scaleX;
          canvas.height = crop.height * scaleY;
    
          ctx.drawImage(
            optimizedImg,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
          );
    
          const dataUrl = canvas.toDataURL(image.file.type, quality);
          setEditedImage(dataUrl);
          toast({
            title: 'Image cropped',
            status: 'success',
            duration: 2000,
            isClosable: true
          });
        };
        img.src = image.preview;

        return () => {
          isMounted = false
          img.onload = null
          img.onerror = null
        }
      } catch (error) {
        console.error('Error cropping image:', error);
        toast({
          title: 'Error cropping image',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
      } finally {
        setCropping(false)
      }
    }, [imgRef, crop, quality, image.file.type, image.preview, setEditedImage, toast])

  const resetCrop = useCallback(() => {
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25
    });
  }, []);

  return (
    <VStack spacing={6} align="stretch">
      <ButtonGroup size="sm" mb={4} isAttached variant="outline" role="toolbar" aria-label="Crop aspect ratio controls">
        <Button onClick={() => setCrop({...crop, aspect: aspectRatios.square})} flex={1} aria-label="Square aspect ratio">Square</Button>
        <Button onClick={() => setCrop({...crop, aspect: aspectRatios.landscape})} flex={1} aria-label="16:9 landscape aspect ratio">16:9</Button>
        <Button onClick={() => setCrop({...crop, aspect: aspectRatios.portrait})} flex={1} aria-label="3:4 portrait aspect ratio">3:4</Button>
        <Button onClick={() => setCrop({...crop, aspect: aspectRatios.none})} flex={1} aria-label="Free aspect ratio">Free</Button>
      </ButtonGroup>
      <Box maxH="500px" overflow="auto" role="region" aria-label="Image crop editor">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={crop.aspect}
          ruleOfThirds
          aria-label="Crop area"
        >
          <img
            ref={imgRef}
            src={image.preview}
            style={{ maxWidth: '100%' }}
            alt="Crop preview"
            role="application"
            aria-label="Image being cropped"
          />
        </ReactCrop>
      </Box>
      <FormControl role="group" aria-label="Output quality control">
        <FormLabel id="quality-label">Output Quality: {Math.round(quality * 100)}%</FormLabel>
        <Slider 
          value={quality * 100} 
          onChange={(val) => setQuality(val/100)} 
          min={10} 
          max={100}
          aria-labelledby="quality-label"
          aria-valuemin={10}
          aria-valuemax={100}
          aria-valuenow={Math.round(quality * 100)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      <ButtonGroup spacing={4} role="toolbar" aria-label="Crop actions">
        <Button
          onClick={handleCrop}
          colorScheme="blue"
          isLoading={cropping}
          loadingText="Cropping..."
          aria-label="Apply crop"
        >
          Crop Image
        </Button>
        <Button onClick={resetCrop} variant="outline" aria-label="Reset crop selection">Reset</Button>
      </ButtonGroup>
    </VStack>
  )
}