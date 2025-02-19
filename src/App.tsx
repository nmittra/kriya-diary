import { Box, Container, Heading, VStack, useColorModeValue } from '@chakra-ui/react'
import { ImageUploader } from './components/ImageUploader'
import { EditorPage } from './pages/EditorPage'
import { CookieConsent } from './components/CookieConsent'
import { Footer } from './components/Footer'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { LandingPage } from './components/LandingPage'
import { CompressPage } from './pages/CompressPage'
import { ResizePage } from './pages/ResizePage'
import { WatermarkPage } from './pages/WatermarkPage'
import { CropPage } from './pages/CropPage'
import { ConvertPage } from './pages/ConvertPage'
import { MemePage } from './pages/MemePage'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfService } from './pages/TermsOfService'
import { CookiePolicy } from './pages/CookiePolicy'
import { Copyright } from './pages/Copyright'
import { Contact } from './pages/Contact'
import { Sitemap } from './pages/Sitemap'

interface ImageFile {
  file: File
  preview: string
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)
  const bg = useColorModeValue('gray.50', 'gray.800')

  return (
    <Router>
      <ScrollToTop />
      <Box bg={bg} minH="100vh" display="flex" flexDirection="column">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/compress" element={<CompressPage />} />
          <Route path="/resize" element={<ResizePage />} />
          <Route path="/watermark" element={<WatermarkPage />} />
          <Route path="/editor/crop" element={<CropPage />} />
          <Route path="/editor/convert" element={<ConvertPage />} />
          <Route path="/editor/meme" element={<MemePage />} />
          <Route path="/editor/main" element={<EditorPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/copyright" element={<Copyright />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sitemap" element={<Sitemap />} />
        </Routes>
        <Footer />
        <CookieConsent />
      </Box>
    </Router>
  )
}

export default App
