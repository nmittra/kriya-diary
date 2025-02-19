import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  preferences: boolean
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    preferences: false,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setShowBanner(true)
    } else {
      setPreferences(JSON.parse(consent))
    }
  }, [])

  const handleAcceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      preferences: true,
    }
    localStorage.setItem('cookieConsent', JSON.stringify(allPreferences))
    setPreferences(allPreferences)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences))
    setShowBanner(false)
    onClose()
  }

  if (!showBanner) return null

  return (
    <>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1000}
        p={4}
        bg={bgColor}
        borderTop="1px"
        borderColor={borderColor}
        boxShadow="lg"
      >
        <Container maxW="container.lg">
          <HStack spacing={4} justify="space-between" align="center">
            <VStack align="start" spacing={2} flex={1}>
              <Heading size="md">We value your privacy</Heading>
              <Text fontSize="sm" color="gray.600">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
              </Text>
            </VStack>
            <HStack spacing={4}>
              <Button variant="outline" onClick={onOpen}>
                Customize
              </Button>
              <Button colorScheme="blue" onClick={handleAcceptAll}>
                Accept All
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cookie Preferences</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel display="flex" justifyContent="space-between" alignItems="center">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">Essential Cookies</Text>
                    <Text fontSize="sm" color="gray.600">
                      Required for the website to function properly
                    </Text>
                  </VStack>
                  <Switch isChecked={preferences.essential} isDisabled />
                </FormLabel>
              </FormControl>

              <FormControl>
                <FormLabel display="flex" justifyContent="space-between" alignItems="center">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">Analytics Cookies</Text>
                    <Text fontSize="sm" color="gray.600">
                      Help us understand how visitors interact with our website
                    </Text>
                  </VStack>
                  <Switch
                    isChecked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  />
                </FormLabel>
              </FormControl>

              <FormControl>
                <FormLabel display="flex" justifyContent="space-between" alignItems="center">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">Preference Cookies</Text>
                    <Text fontSize="sm" color="gray.600">
                      Remember your settings and preferences
                    </Text>
                  </VStack>
                  <Switch
                    isChecked={preferences.preferences}
                    onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  />
                </FormLabel>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}