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
  VStack,  // Add VStack to imports
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
import { useParams } from 'react-router-dom'

export const ImageEditor = ({ selectedImage: propSelectedImage, defaultTab }: {
  selectedImage?: { file: File; preview: string } | null
  defaultTab?: string
}) => {
  return (
    <Box p={6} bg={bg} borderRadius="lg" shadow="md" minH="600px" w="100%">
      <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={6}>
        <Box>
          <Image
            src={selectedImage?.preview}
            alt="Preview"
            maxH="300px"
            objectFit="contain"
            w="100%"
            borderRadius="md"
          />
          <HStack mt={4} spacing={4} justify="center">
            <Button
              leftIcon={<FiDownload />}
              onClick={handleDownload}
              colorScheme="blue"
            >
              Download
            </Button>
            <Button
              leftIcon={<FiTrash2 />}
              onClick={() => setSelectedImage(null)}
              colorScheme="red"
              variant="ghost"
            >
              Remove
            </Button>
          </HStack>
        </Box>

        <Box>
          <Tabs variant="enclosed" defaultIndex={getDefaultTabIndex()} isLazy>
            <TabList>
              <Tab>Resize</Tab>
              <Tab>Compress</Tab>
              <Tab>Watermark</Tab>
              <Tab>Convert</Tab>
              <Tab>Crop</Tab>
              <Tab>Meme</Tab>
            </TabList>
            <TabPanels>
              <TabPanel minH="500px">
                <ResizePanel image={selectedImage} setEditedImage={setEditedImage} />
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
    </Box>
  )
}