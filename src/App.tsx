import { Box, useColorModeValue } from '@chakra-ui/react'
import { lazy, Suspense } from 'react'
import { CookieConsent } from './components/CookieConsent'
import { Footer } from './components/Footer'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

// Lazy load components
const LandingPage = lazy(() => import('./components/LandingPage'))
const CompressPage = lazy(() => import('./pages/CompressPage'))
const ResizePage = lazy(() => import('./pages/ResizePage'))
const WatermarkPage = lazy(() => import('./pages/WatermarkPage'))
const CropPage = lazy(() => import('./pages/CropPage'))
const ConvertPage = lazy(() => import('./pages/ConvertPage'))
const MemePage = lazy(() => import('./pages/MemePage'))
const EditorPage = lazy(() => import('./pages/EditorPage'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const Copyright = lazy(() => import('./pages/Copyright'))
const Contact = lazy(() => import('./pages/Contact'))
const Sitemap = lazy(() => import('./pages/Sitemap'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  const bg = useColorModeValue('gray.50', 'gray.800')

  return (
    <Router>
      <ScrollToTop />
      <Box bg={bg} minH="100vh" display="flex" flexDirection="column">
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
        <Footer />
        <CookieConsent />
      </Box>
    </Router>
  )
}

export default App
