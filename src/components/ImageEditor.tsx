import {
  Box,
  Button,
  Grid,
  HStack,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FiDownload, FiTrash2 } from 'react-icons/fi'
import { ResizePanel } from './editor/ResizePanel'
import { CompressPanel } from './editor/CompressPanel'
import { WatermarkPanel } from './editor/WatermarkPanel'
import { ConvertPanel } from './editor/ConvertPanel'
import { CropPanel } from './editor/CropPanel'
import { MemePanel } from './editor/MemePanel'

interface ImageEditorProps {
  selectedImage: {
    file: File
    preview: string
  }
  setSelectedImage: (image: { file: File; preview: string } | null) => void
}

export function ImageEditor({ selectedImage, setSelectedImage }: ImageEditorProps) {
  const [editedImage, setEditedImage] = useState<string>(selectedImage.preview)
  const bg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = editedImage
    link.download = `edited-${selectedImage.file.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Grid
      templateColumns={{ base: '1fr', lg: '1fr 400px' }}
      gap={8}
      w="100%"
      alignItems="start"
    >
      <Box
        bg={bg}
        p={6}
        borderRadius="xl"
        borderWidth={1}
        borderColor={borderColor}
      >
        <VStack spacing={4}>
          <Box
            position="relative"
            w="100%"
            h="500px"
            overflow="auto"
          >
            <Image
              src={editedImage}
              alt="Preview"
              maxW="100%"
              h="100%"
              mx="auto"
              objectFit="contain"
              display="block"
            />
          </Box>
          <HStack spacing={4} w="100%" justify="center">
            <Button
              leftIcon={<FiDownload />}
              colorScheme="blue"
              onClick={handleDownload}
            >
              Download
            </Button>
            <Button
              leftIcon={<FiTrash2 />}
              variant="ghost"
              onClick={() => setSelectedImage(null)}
            >
              Remove
            </Button>
          </HStack>
        </VStack>
      </Box>

      <Box
        bg={bg}
        p={6}
        borderRadius="xl"
        borderWidth={1}
        borderColor={borderColor}
      >
        <Tabs isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab>Resize</Tab>
            <Tab>Compress</Tab>
            <Tab>Watermark</Tab>
            <Tab>Convert</Tab>
            <Tab>Crop</Tab>
            <Tab>Meme</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ResizePanel
                image={selectedImage}
                setEditedImage={setEditedImage}
              />
            </TabPanel>
            <TabPanel>
              <CompressPanel
                image={selectedImage}
                setEditedImage={setEditedImage}
              />
            </TabPanel>
            <TabPanel>
              <WatermarkPanel
                image={selectedImage}
                setEditedImage={setEditedImage}
              />
            </TabPanel>
            <TabPanel>
              <ConvertPanel
                image={selectedImage}
                setEditedImage={setEditedImage}
              />
            </TabPanel>
            <TabPanel>
              <CropPanel
                image={selectedImage}
                setEditedImage={setEditedImage}
              />
            </TabPanel>
            <TabPanel>
              <MemePanel
                image={selectedImage}
                setEditedImage={setEditedImage}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Grid>
  )
}