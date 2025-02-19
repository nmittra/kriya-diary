import { Box, HStack, Image, Text } from '@chakra-ui/react'

export function Logo() {
  return (
    <HStack spacing={2} align="center">
      <Box boxSize="80px">
        <Image
          src="/logo.svg"
          alt="Image Shark Logo"
          width="100%"
          height="100%"
          objectFit="contain"
        />
      </Box>
      <Text
        fontSize="2xl"
        fontWeight="medium"
        fontFamily="'Inter', sans-serif"
        letterSpacing="tight"
        style={{ textTransform: 'lowercase' }}
      >
        image shark
      </Text>
    </HStack>
  )
}