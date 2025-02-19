import { Box, Container, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { Header } from '../components/Header'

// Change from export function Copyright() to:
const Copyright = () => {
  const bg = useColorModeValue('gray.50', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Box bg={bg} minH="100vh">
      <Header />
      <Container maxW="container.lg" py={12}>
        <VStack spacing={8} align="start">
          <Heading as="h1" size="xl">
            Copyright Notice
          </Heading>

          <Text color={textColor}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>

          <VStack spacing={6} align="start">
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Copyright Protection
              </Heading>
              <Text color={textColor}>
                All content on this website, including but not limited to text, graphics, logos, images, software, code, and the compilation of all content on this site, is the property of Image Editor or its content suppliers and is protected by international copyright laws.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Ownership of Content
              </Heading>
              <Text color={textColor}>
                The materials on this site are protected by copyright and trademark laws. Users may not modify, copy, reproduce, republish, upload, post, transmit, or distribute in any way any material from this site including code and software without express written permission from Image Editor.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                User-Generated Content
              </Heading>
              <Text color={textColor}>
                Users retain all rights to the images they upload for editing. By using our service, you warrant that you own the copyright to the images you upload or have obtained necessary permissions for their use.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Fair Use
              </Heading>
              <Text color={textColor}>
                Limited quotations from the content of this site may be used for legitimate purpose of criticism, review, research, or news reporting, with appropriate attribution to Image Editor. Any other use of content requires written permission.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Trademarks
              </Heading>
              <Text color={textColor}>
                All trademarks, service marks, trade names, and logos displayed on this website are proprietary to Image Editor or their respective owners. Nothing contained on this website should be construed as granting any license or right to use any trademark without prior written permission of Image Editor or the third party that owns the trademark.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Reporting Copyright Violations
              </Heading>
              <Text color={textColor}>
                If you believe that your work has been copied in a way that constitutes copyright infringement, please contact us at nmittra@gmail.com with the following information:
              </Text>
              <VStack spacing={3} align="start" pl={4} mt={2}>
                <Text color={textColor}>• A description of the copyrighted work that you claim has been infringed</Text>
                <Text color={textColor}>• A description of where the material you claim is infringing is located on the site</Text>
                <Text color={textColor}>• Your contact information</Text>
                <Text color={textColor}>• A statement by you that you have a good faith belief that the disputed use is not authorized</Text>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </Container>

    </Box>
  )
}

export default Copyright