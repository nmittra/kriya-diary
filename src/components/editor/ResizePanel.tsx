import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Switch,
  VStack,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb
} from '@chakra-ui/react'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

interface ResizePanelProps {
  image: {
    file: File
    preview: string
  }
  setEditedImage: (preview: string) => void
}

const presets = [
  { name: "HD (1280×720)", width: 1280, height: 720 },
  { name: "Full HD (1920×1080)", width: 1920, height: 1080 },
  { name: "4K (3840×2160)", width: 3840, height: 2160 },
  { name: "Social Media (1200×630)", width: 1200, height: 630 },
];

export function ResizePanel({ image, setEditedImage }: ResizePanelProps) {
  const toast = useToast()
  const navigate = useNavigate()
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null)
  const [quality, setQuality] = useState(0.92)
  const [isResizing, setIsResizing] = useState(false)

  const loadImageDimensions = useCallback(() => {
    const img = new Image()
    let isMounted = true

    img.onload = () => {
      if (isMounted) {
        setOriginalDimensions({ width: img.width, height: img.height })
        setWidth(String(img.width))
        setHeight(String(img.height))
      }
    }

    img.onerror = () => {
      if (isMounted) {
        toast({
          title: 'Error loading image',
          description: 'Could not load image dimensions',
          status: 'error',
          duration: 2000,
          isClosable: true
        })
      }
    }

    img.src = image.preview

    return () => {
      isMounted = false
      img.onload = null
      img.onerror = null
    }
  }, [image.preview, toast])

  useEffect(() => {
    const cleanup = loadImageDimensions()
    return () => cleanup()
  }, [loadImageDimensions])

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    const numWidth = Number(newWidth);

    // Only allow numbers
    if (!/^\d*$/.test(newWidth)) {
      return;
    }

    if (newWidth === '' || (numWidth >= 1 && numWidth <= 10000)) {
      setWidth(newWidth);
      
      if (maintainAspectRatio && originalDimensions && newWidth !== '') {
        const ratio = originalDimensions.height / originalDimensions.width;
        const newHeight = Math.round(numWidth * ratio);
        if (newHeight <= 10000) {
          setHeight(String(newHeight));
        } else {
          // Show warning about exceeding maximum dimensions
          toast({
            title: "Height would exceed maximum",
            description: "The height would exceed 10000px with current aspect ratio",
            status: "warning",
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    const numHeight = Number(newHeight);

    // Only allow numbers
    if (!/^\d*$/.test(newHeight)) {
      return;
    }

    if (newHeight === '' || (numHeight >= 1 && numHeight <= 10000)) {
      setHeight(newHeight);

      if (maintainAspectRatio && originalDimensions && newHeight !== '') {
        const ratio = originalDimensions.width / originalDimensions.height;
        const newWidth = Math.round(numHeight * ratio);
        if (newWidth <= 10000) {
          setWidth(String(newWidth));
        } else {
          // Show warning about exceeding maximum dimensions
          toast({
            title: "Width would exceed maximum",
            description: "The width would exceed 10000px with current aspect ratio",
            status: "warning",
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  }

  const aspectRatio = useMemo(() => {
    if (originalDimensions) {
      return originalDimensions.width / originalDimensions.height;
    }
    return null;
  }, [originalDimensions]);

  const handleResize = useCallback(async () => {
    try {
      // Validate inputs before proceeding
      if (!width || !height || Number(width) <= 0 || Number(height) <= 0) {
        toast({
          title: 'Invalid dimensions',
          description: 'Please enter valid width and height values',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
        return;
      }

      // Check for unreasonably large dimensions
      if (Number(width) > 10000 || Number(height) > 10000) {
        toast({
          title: 'Dimensions too large',
          description: 'Maximum allowed dimension is 10000px',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
        return;
      }

      setIsResizing(true);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not initialize canvas context');
      }

      const img = new Image();
      
      img.onerror = () => {
        throw new Error('Failed to load image for resizing');
      };

      await new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Handle large image scaling
            const MAX_SIZE = 2000; // Maximum dimension
            let finalWidth = Number(width);
            let finalHeight = Number(height);
            
            if (finalWidth > MAX_SIZE || finalHeight > MAX_SIZE) {
              const scale = MAX_SIZE / Math.max(finalWidth, finalHeight);
              finalWidth = Math.round(finalWidth * scale);
              finalHeight = Math.round(finalHeight * scale);
              
              toast({
                title: 'Image scaled down',
                description: 'Image dimensions were reduced to prevent memory issues',
                status: 'warning',
                duration: 3000,
                isClosable: true
              });
            }
            
            canvas.width = finalWidth;
            canvas.height = finalHeight;
            
            // Set image smoothing quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Set image smoothing quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
            const resizedImage = canvas.toDataURL(image.file.type, quality);
            
            if (!resizedImage || resizedImage === 'data:,') {
              throw new Error('Failed to generate resized image');
            }
            
            setEditedImage(resizedImage);
            navigate('/download?image=' + encodeURIComponent(resizedImage) + '&fileName=' + encodeURIComponent(image.file.name) + '&tab=resize');
            
            toast({
              title: 'Image resized successfully',
              status: 'success',
              duration: 2000,
              isClosable: true
            });
            
            resolve(undefined);
          } catch (error) {
            reject(error);
          }
        };
        
        img.src = image.preview;
      });
    } catch (error) {
      console.error('Error resizing image:', error);
      toast({
        title: 'Error resizing image',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsResizing(false);
      
      // Clean up resources
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    }
  }, [width, height, quality, image.file.type, image.preview, image.file.name, setEditedImage, navigate, toast]);

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Presets</FormLabel>
        <HStack wrap="wrap" spacing={2}>
          {presets.map(preset => (
            <Button 
              key={preset.name} 
              size="sm" 
              onClick={() => {
                setWidth(String(preset.width));
                setHeight(String(preset.height));
                setMaintainAspectRatio(false); // Disable aspect ratio for presets
              }}
            >
              {preset.name}
            </Button>
          ))}
          <Button
            size="sm"
            onClick={() => {
              if (originalDimensions) {
                setWidth(String(originalDimensions.width));
                setHeight(String(originalDimensions.height));
              }
            }}
          >
            Original
          </Button>
        </HStack>
      </FormControl>

      <FormControl>
        <FormLabel>Width (px)</FormLabel>
        <Input
          type="number"
          value={width}
          onChange={handleWidthChange}
          min="1"
          max="10000"
          step="1"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Height (px)</FormLabel>
        <Input
          type="number"
          value={height}
          onChange={handleHeightChange}
          min="1"
          max="10000"
          step="1"
        />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Maintain aspect ratio
        </FormLabel>
        <Switch
          isChecked={maintainAspectRatio}
          onChange={(e) => setMaintainAspectRatio(e.target.checked)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Original dimensions: {originalDimensions ? `${originalDimensions.width}×${originalDimensions.height}px` : 'Loading...'}</FormLabel>
        <FormLabel>New dimensions: {width}×{height}px</FormLabel>
        {originalDimensions && width && height && (
          <FormLabel>
            Scale: {Math.round((Number(width) / originalDimensions.width) * 100)}% of original
          </FormLabel>
        )}
      </FormControl>

      <FormControl>
        <FormLabel>Quality: {Math.round(quality * 100)}%</FormLabel>
        <Slider 
          value={quality * 100} 
          min={10} 
          max={100} 
          step={5}
          onChange={(val) => setQuality(val / 100)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <HStack spacing={4} width="100%">
        <Button 
          colorScheme="blue" 
          onClick={handleResize}
          isLoading={isResizing}
          loadingText="Resizing..."
          flex={1}
        >
          Resize Image
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            if (originalDimensions) {
              setWidth(String(originalDimensions.width));
              setHeight(String(originalDimensions.height));
            }
          }}
          flex={1}
        >
          Reset
        </Button>
      </HStack>
    </VStack>
  )
}