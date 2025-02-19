import { Box, Container, Heading, VStack, useColorModeValue } from '@chakra-ui/react'
import { ImageUploader } from './components/ImageUploader'
import { ImageEditor } from './components/ImageEditor'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './components/LandingPage'
import { CompressPage } from './pages/CompressPage'
import { ResizePage } from './pages/ResizePage'
import { WatermarkPage } from './pages/WatermarkPage'

interface ImageFile {
  file: File
  preview: string
}

function App() {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)
  const bg = useColorModeValue('gray.50', 'gray.800')

  return (
    <Router>
      <Box bg={bg} minH="100vh">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/compress" element={<CompressPage />} />
          <Route path="/resize" element={<ResizePage />} />
          <Route path="/watermark" element={<WatermarkPage />} />
          <Route path="/editor" element={<CompressPage defaultTab="editor" />} />
        </Routes>
      </Box>
    </Router>
  )
}

export default App
