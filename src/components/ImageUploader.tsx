import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUploadCloud } from 'react-icons/fi'

interface ImageUploaderProps {
  setSelectedImage: (image: { file: File; preview: string } | null) => void
}

export function ImageUploader({ setSelectedImage }: ImageUploaderProps) {
  const borderColor = useColorModeValue('gray.300', 'gray.600')
  const bgHover = useColorModeValue('gray.100', 'gray.700')

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const preview = URL.createObjectURL(file)
        setSelectedImage({ file, preview })
      }
    },
    [setSelectedImage]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  return (
    <Box
      w="100%"
      p={8}
      {...getRootProps()}
      cursor="pointer"
      borderWidth={2}
      borderStyle="dashed"
      borderColor={borderColor}
      borderRadius="xl"
      _hover={{ bg: bgHover }}
      transition="background 0.2s"
    >
      <input {...getInputProps()} />
      <VStack spacing={4}>
        <FiUploadCloud size={48} />
        <Text fontSize="lg" textAlign="center">
          {isDragActive
            ? 'Drop the image here'
            : 'Drag and drop an image here, or click to select'}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Supports: JPG, PNG, GIF, WebP
        </Text>
      </VStack>
    </Box>
  )
}