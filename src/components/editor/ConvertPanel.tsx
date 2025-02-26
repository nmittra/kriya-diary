import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Text,
  useToast,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Badge,
  Progress,
  FormHelperText,
  useColorModeValue
} from '@chakra-ui/react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

interface ConvertPanelProps {
  image: {
    file: File
    preview: string
  }
  setEditedImage: (preview: string) => void
}

// Helper to get friendly format name
const getFormatName = (mimeType: string): string => {
  const formatMap: Record<string, string> = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'image/gif': 'GIF',
    'image/bmp': 'BMP',
    'image/svg+xml': 'SVG',
    'image/avif': 'AVIF',
    'image/tiff': 'TIFF'
  };
  return formatMap[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'Unknown';
};

// Helper to estimate file size after conversion
const estimateFileSize = (
  originalSize: number, 
  originalFormat: string, 
  targetFormat: string, 
  quality: number
): number => {
  // Very rough estimation factors
  const factors: Record<string, Record<string, number>> = {
    'image/jpeg': {
      'image/png': 1.5,
      'image/webp': 0.7,
      'image/avif': 0.5,
      'image/tiff': 2.0
    },
    'image/png': {
      'image/jpeg': 0.7,
      'image/webp': 0.6,
      'image/avif': 0.4,
      'image/tiff': 1.8
    },
    'image/webp': {
      'image/jpeg': 1.2,
      'image/png': 1.7,
      'image/avif': 0.8,
      'image/tiff': 2.2
    },
    'image/avif': {
      'image/jpeg': 1.8,
      'image/png': 2.2,
      'image/webp': 1.4,
      'image/tiff': 2.5
    },
    'image/tiff': {
      'image/jpeg': 0.5,
      'image/png': 0.6,
      'image/webp': 0.4,
      'image/avif': 0.3
    }
  };
  
  const factor = factors[originalFormat]?.[targetFormat] || 1;
  // Adjust for quality (if applicable)
  const qualityFactor = (targetFormat === 'image/jpeg' || targetFormat === 'image/webp') 
    ? quality
    : 1;
  
  return Math.round(originalSize * factor * qualityFactor);
};

// Helper to get format compatibility information
const getFormatCompatibility = (format: string): { browsers: string, notes: string } => {
  switch (format) {
    case 'image/webp':
      return {
        browsers: 'Chrome, Firefox, Edge, Safari 14+',
        notes: 'Great balance of quality and compression. Not supported in older browsers.'
      };
    case 'image/avif':
      return {
        browsers: 'Chrome, Firefox 92+, Edge',
        notes: 'Best compression but limited browser support.'
      };
    case 'image/jpeg':
      return {
        browsers: 'All browsers',
        notes: 'Universal support but lossy compression.'
      };
    case 'image/png':
      return {
        browsers: 'All browsers',
        notes: 'Lossless but larger file size.'
      };
    case 'image/tiff':
      return {
        browsers: 'Limited browser support',
        notes: 'Typically requires download to view. Best for print/archival.'
      };
    default:
      return { browsers: 'Varies', notes: '' };
  }
};

export function ConvertPanel({ image, setEditedImage }: ConvertPanelProps) {
  // Extract current format from file
  const currentFormat = image.file.type || 'image/jpeg';
  const currentFormatName = getFormatName(currentFormat);
  
  // State management
  const [preset, setPreset] = useState<string | null>(null);
  const [format, setFormat] = useState(currentFormat !== 'image/webp' ? 'image/webp' : 'image/jpeg');
  const [quality, setQuality] = useState(92);
  const [showTooltip, setShowTooltip] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();
  const navigate = useNavigate();
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Reset error and preview when format changes
  useEffect(() => {
    setError(null);
    setPreviewUrl(null);
  }, [format]);

  // Estimated file size after conversion
  const estimatedSize = useMemo(() => {
    return estimateFileSize(
      image.file.size,
      currentFormat,
      format,
      quality / 100
    );
  }, [image.file.size, currentFormat, format, quality]);
  
  const formatSizeDiff = useMemo(() => {
    const diff = estimatedSize - image.file.size;
    const percentDiff = Math.round((diff / image.file.size) * 100);
    return {
      diff,
      percentDiff,
      isSmaller: diff < 0
    };
  }, [estimatedSize, image.file.size]);
  
  // Memoized conversion function with chunked processing for large images
  const convertImage = useCallback(async () => {
    try {
      setConverting(true);
      setProgress(10);
      setError(null);
      
      const MAX_DIMENSION = 4000; // Maximum dimension for processing
      const CHUNK_SIZE = 1000; // Process in chunks for large images
      
      // Create canvas - fallback to regular canvas if OffscreenCanvas is not supported
      const canvas = typeof OffscreenCanvas !== 'undefined' ? 
        new OffscreenCanvas(1, 1) : 
        document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not initialize image editor');
      }
      
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        
        img.onerror = () => { 
          reject(new Error('The image could not be loaded')); 
        };
        
        img.onload = async () => {
          try {
            setProgress(30);
            
            // Handle oversized images
            let finalWidth = img.width;
            let finalHeight = img.height;
            
            if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
              const scale = MAX_DIMENSION / Math.max(img.width, img.height);
              finalWidth = Math.floor(img.width * scale);
              finalHeight = Math.floor(img.height * scale);
            }
            
            // Set canvas size
            canvas.width = finalWidth;
            canvas.height = finalHeight;
            
            // Process large images in chunks for better UI responsiveness
            if (finalWidth * finalHeight > CHUNK_SIZE * CHUNK_SIZE) {
              // Processing in chunks with requestAnimationFrame
              const numChunks = Math.ceil((finalWidth * finalHeight) / (CHUNK_SIZE * CHUNK_SIZE));
              const chunksPerRow = Math.ceil(finalWidth / CHUNK_SIZE);
              
              let processedChunks = 0;
              
              const processChunk = () => {
                if (processedChunks >= numChunks) {
                  finishConversion();
                  return;
                }
                
                const row = Math.floor(processedChunks / chunksPerRow);
                const col = processedChunks % chunksPerRow;
                
                const x = col * CHUNK_SIZE;
                const y = row * CHUNK_SIZE;
                const w = Math.min(CHUNK_SIZE, finalWidth - x);
                const h = Math.min(CHUNK_SIZE, finalHeight - y);
                
                ctx.drawImage(
                  img,
                  x * (img.width / finalWidth),
                  y * (img.height / finalHeight),
                  w * (img.width / finalWidth),
                  h * (img.height / finalHeight),
                  x, y, w, h
                );
                
                processedChunks++;
                setProgress(30 + Math.floor((processedChunks / numChunks) * 50));
                
                requestAnimationFrame(processChunk);
              };
              
              processChunk();
            } else {
              // Process small images all at once
              ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
              setProgress(80);
              finishConversion();
            }
            
            async function finishConversion() {
              try {
                let imageData;
                
                if ('convertToBlob' in canvas) {
                  // Use blob for better memory management with large images
                  const blob = await (canvas as OffscreenCanvas).convertToBlob({
                    type: format,
                    quality: (format === 'image/jpeg' || format === 'image/webp') ? quality / 100 : undefined
                  });
                  
                  // Convert blob to data URL
                  const reader = new FileReader();
                  imageData = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error('Failed to generate image data'));
                    reader.readAsDataURL(blob);
                  });
                } else {
                  // Fallback for regular canvas
                  imageData = (canvas as HTMLCanvasElement).toDataURL(
                    format,
                    (format === 'image/jpeg' || format === 'image/webp') ? quality / 100 : undefined
                  );
                }
                
                if (!imageData || typeof imageData !== 'string') {
                  throw new Error('Invalid image data generated');
                }
                
                setProgress(100);
                resolve(imageData);
              } catch (e) {
                reject(e);
              }
            }
          } catch (e) {
            reject(e instanceof Error ? e : new Error(String(e)));
          }
        };
        
        img.src = image.preview;
      });
    } catch (error) {
      throw error;
    }
  }, [format, quality, image.preview]);
  
  const handlePreview = async () => {
    try {
      setConverting(true);
      setProgress(10);
      setError(null);
      
      const dataUrl = await convertImage();
      setPreviewUrl(dataUrl);
      
      toast({
        title: 'Preview generated',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error generating preview:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: 'Error generating preview',
        description: error instanceof Error ? error.message : 'Failed to generate preview',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
    } finally {
      setConverting(false);
      setProgress(0);
    }
  };

  const handleConvert = async () => {
    try {
      // Skip conversion if format is the same and quality doesn't matter
      if (format === currentFormat && (format !== 'image/jpeg' && format !== 'image/webp')) {
        toast({
          title: 'No conversion needed',
          description: `The image is already in ${currentFormatName} format.`,
          status: 'info',
          duration: 3000,
          isClosable: true
        });
        return;
      }
      
      const dataUrl = await convertImage();
      
      // Update the edited image
      setEditedImage(dataUrl);
      
      // Generate a unique key for localStorage
      const storageKey = `converted_image_${Date.now()}`;
      try {
        // Store the converted image data in localStorage
        localStorage.setItem(storageKey, dataUrl);
        
        // Create URL parameters with only the storage key
        const searchParams = new URLSearchParams({
          imageKey: storageKey,
          fileName: image.file.name,
          tab: 'convert'
        });
        
        // Navigate to download page
        navigate(`/download?${searchParams.toString()}`);
        
        toast({
          title: 'Image converted',
          status: 'success',
          duration: 2000,
          isClosable: true
        });
      } catch (storageError) {
        console.error('Error storing converted image:', storageError);
        toast({
          title: 'Error saving converted image',
          description: 'The image was converted but could not be saved. Please try again with a smaller image.',
          status: 'error',
          duration: 4000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error converting image:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: 'Error converting image',
        description: error instanceof Error ? error.message : 'Failed to convert the image',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
    } finally {
      setConverting(false);
      setProgress(0);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Current format info */}
      <Box 
        p={3} 
        borderRadius="md" 
        bg={useColorModeValue('blue.50', 'blue.900')}
      >
        <Text fontSize="sm" fontWeight="medium">
          Current format: <Badge colorScheme="blue">{currentFormatName}</Badge>
          <Text as="span" ml={2} fontWeight="normal">
            ({(image.file.size / 1024).toFixed(1)} KB)
          </Text>
        </Text>
      </Box>

      {/* Format selection */}
      <FormControl isDisabled={converting}>
        <FormLabel>Quick Presets</FormLabel>
        <ButtonGroup isAttached variant="outline" size="sm" width="full">
          <Button 
            flex={1} 
            onClick={() => {
              setFormat('image/webp');
              setQuality(75);
              setPreset('web');
            }}
            colorScheme={preset === 'web' ? 'blue' : 'gray'}
          >
            Web Optimized
          </Button>
          <Button 
            flex={1} 
            onClick={() => {
              setFormat('image/jpeg');
              setQuality(92);
              setPreset('photo');
            }}
            colorScheme={preset === 'photo' ? 'blue' : 'gray'}
          >
            Photo Quality
          </Button>
          <Button 
            flex={1} 
            onClick={() => {
              setFormat('image/png');
              setQuality(100);
              setPreset('lossless');
            }}
            colorScheme={preset === 'lossless' ? 'blue' : 'gray'}
          >
            Lossless
          </Button>
        </ButtonGroup>
      </FormControl>

      <FormControl isDisabled={converting}>
        <FormLabel htmlFor="format-select">Convert to Format</FormLabel>
        <Select
          id="format-select"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="image/jpeg">JPEG</option>
          <option value="image/png">PNG</option>
          <option value="image/webp">WebP</option>
          <option value="image/avif">AVIF</option>
          <option value="image/tiff">TIFF</option>
        </Select>
        <FormHelperText>
          Estimated size: {(estimatedSize / 1024).toFixed(1)} KB
          {formatSizeDiff.diff !== 0 && (
            <Text as="span" color={formatSizeDiff.isSmaller ? "green.500" : "red.500"}>
              {' '}({formatSizeDiff.isSmaller ? '-' : '+'}{Math.abs(formatSizeDiff.percentDiff)}%)
            </Text>
          )}
        </FormHelperText>
        <Box mt={2} fontSize="xs" color={textColor}>
          <Text fontWeight="medium">Compatibility: {getFormatCompatibility(format).browsers}</Text>
          <Text>{getFormatCompatibility(format).notes}</Text>
        </Box>
      </FormControl>

      {/* Quality slider (only for formats that support it) */}
      {(format === 'image/jpeg' || format === 'image/webp') && (
        <FormControl isDisabled={converting}>
          <FormLabel htmlFor="quality-slider">Quality: {quality}%</FormLabel>
          <Slider
            id="quality-slider"
            min={10}
            max={100}
            value={quality}
            onChange={(val) => setQuality(val)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="blue.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={`${quality}%`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
          <FormHelperText>
            Higher quality = larger file size
          </FormHelperText>
        </FormControl>
      )}

      {/* Error message */}
      {error && (
        <Text color="red.500" fontSize="sm">
          Error: {error}
        </Text>
      )}

      {/* Progress bar */}
      {converting && progress > 0 && (
        <Progress
          value={progress}
          size="sm"
          colorScheme="blue"
          borderRadius="md"
          hasStripe
          isAnimated
        />
      )}

      {/* Convert and Preview buttons */}
      <HStack>
        <Button
          colorScheme="gray"
          onClick={handlePreview}
          isLoading={converting && !previewUrl}
          loadingText="Generating preview"
          isDisabled={format === currentFormat && format !== 'image/jpeg' && format !== 'image/webp'}
          flex={1}
        >
          Preview
        </Button>
        
        <Button
          colorScheme="blue"
          onClick={handleConvert}
          isLoading={converting && !previewUrl}
          loadingText="Converting"
          isDisabled={format === currentFormat && format !== 'image/jpeg' && format !== 'image/webp'}
          flex={1}
        >
          Convert to {getFormatName(format)}
        </Button>
      </HStack>

      {/* Preview display */}
      {previewUrl && (
        <Box mt={4} borderWidth={1} borderRadius="md" p={2}>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Preview:</Text>
          <Box position="relative">
            <Image src={previewUrl} maxH="300px" mx="auto" />
            <Text position="absolute" bottom={0} right={0} fontSize="xs" p={1} bg="blackAlpha.700" color="white">
              Estimated: {(estimatedSize / 1024).toFixed(1)} KB
            </Text>
          </Box>
        </Box>
      )}

      {/* Format comparison info */}
      <HStack 
        spacing={4} 
        justify="space-between" 
        fontSize="xs" 
        color={textColor}
        display={converting ? "none" : "flex"}
      >
        <Text>Original: {(image.file.size / 1024).toFixed(1)} KB</Text>
        <Text>→</Text>
        <Text>
          Estimated: {(estimatedSize / 1024).toFixed(1)} KB
          {formatSizeDiff.diff !== 0 && (
            <Text as="span" color={formatSizeDiff.isSmaller ? "green.500" : "red.500"}>
              {' '}({formatSizeDiff.isSmaller ? '-' : '+'}{Math.abs(formatSizeDiff.percentDiff)}%)
            </Text>
          )}
        </Text>
      </HStack>
    </VStack>
  );
}