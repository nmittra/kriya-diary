import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import { LoadingIndicator } from './components/LoadingIndicator'
import { ErrorBoundary } from './components/ErrorBoundary'
import { RouteErrorBoundary } from './components/RouteErrorBoundary'

// Lazy load components
const LandingPage = lazy(() => import('./components/LandingPage').then(module => ({ default: module.default || module })))
const CompressPage = lazy(() => import('./pages/CompressPage').then(module => ({ default: module.default || module })))
const ResizePage = lazy(() => import('./pages/ResizePage').then(module => ({ default: module.default || module })))
const WatermarkPage = lazy(() => import('./pages/WatermarkPage').then(module => ({ default: module.default || module })))
const EditorPage = lazy(() => import('./pages/EditorPage').then(module => ({ default: module.default || module })))
const CropPage = lazy(() => import('./pages/CropPage').then(module => ({ default: module.default || module })))
const ConvertPage = lazy(() => import('./pages/ConvertPage').then(module => ({ default: module.default || module })))
const MemePage = lazy(() => import('./pages/MemePage').then(module => ({ default: module.default || module })))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(module => ({ default: module.default || module })))
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(module => ({ default: module.default || module })))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy').then(module => ({ default: module.default || module })))
const Copyright = lazy(() => import('./pages/Copyright').then(module => ({ default: module.default || module })))
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.default || module })))
const Sitemap = lazy(() => import('./pages/Sitemap').then(module => ({ default: module.default || module })))
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.default || module })))
const DownloadPage = lazy(() => import('./pages/DownloadPage').then(module => ({ default: module.default || module })))

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { 
        path: '/', 
        element: <Suspense fallback={<LoadingIndicator />}><LandingPage /></Suspense>
      },
      { 
        path: 'compress', 
        element: <Suspense fallback={<LoadingIndicator />}><CompressPage /></Suspense>
      },
      { 
        path: 'resize', 
        element: <Suspense fallback={<LoadingIndicator />}><ResizePage /></Suspense>
      },
      { 
        path: 'watermark', 
        element: <Suspense fallback={<LoadingIndicator />}><WatermarkPage /></Suspense>
      },
      { 
        path: 'crop', 
        element: <Suspense fallback={<LoadingIndicator />}><CropPage /></Suspense>
      },
      { 
        path: 'convert', 
        element: <Suspense fallback={<LoadingIndicator />}><ConvertPage /></Suspense>
      },
      { 
        path: 'meme', 
        element: <Suspense fallback={<LoadingIndicator />}><MemePage /></Suspense>
      },
      { 
        path: 'editor', 
        element: <Suspense fallback={<LoadingIndicator />}><EditorPage /></Suspense>
      },
      { 
        path: 'privacy-policy', 
        element: <Suspense fallback={<LoadingIndicator />}><PrivacyPolicy /></Suspense>
      },
      { 
        path: 'terms-of-service', 
        element: <Suspense fallback={<LoadingIndicator />}><TermsOfService /></Suspense>
      },
      { 
        path: 'cookie-policy', 
        element: <Suspense fallback={<LoadingIndicator />}><CookiePolicy /></Suspense>
      },
      { 
        path: 'copyright', 
        element: <Suspense fallback={<LoadingIndicator />}><Copyright /></Suspense>
      },
      { 
        path: 'contact', 
        element: <Suspense fallback={<LoadingIndicator />}><Contact /></Suspense>
      },
      { 
        path: 'sitemap', 
        element: <Suspense fallback={<LoadingIndicator />}><Sitemap /></Suspense>
      },
      { 
        path: 'download', 
        element: <Suspense fallback={<LoadingIndicator />}><DownloadPage /></Suspense>
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ErrorBoundary>
        <Suspense fallback={<LoadingIndicator />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </ChakraProvider>
  </StrictMode>
)
