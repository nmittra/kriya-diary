import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
} from '@chakra-ui/react'
import { useState, useCallback } from 'react'

interface WatermarkPanelProps {
  image: {
    file: File
    preview: string
  }
  setEditedImage: (preview: string) => void
}

export function WatermarkPanel({ image, setEditedImage }: WatermarkPanelProps) {
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(24)
  const [opacity, setOpacity] = useState(50)
  const [position, setPosition] = useState({ x: 50, y: 50 })

  const applyWatermark = useCallback(() => {
    if (!text) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // Draw the original image
      ctx.drawImage(img, 0, 0)

      // Configure watermark text
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity / 100})`
      ctx.font = `${fontSize}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Calculate position
      const x = (img.width * position.x) / 100
      const y = (img.height * position.y) / 100

      // Draw watermark
      ctx.fillText(text, x, y)

      // Update the image
      setEditedImage(canvas.toDataURL(image.file.type))
    }
    img.src = image.preview
  }, [text, fontSize, opacity, position, image, setEditedImage])

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Watermark Text</FormLabel>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter watermark text"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Font Size: {fontSize}px</FormLabel>
        <NumberInput
          value={fontSize}
          onChange={(_, value) => setFontSize(value)}
          min={12}
          max={200}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>Opacity: {opacity}%</FormLabel>
        <Slider
          value={opacity}
          onChange={setOpacity}
          min={0}
          max={100}
          step={1}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl>
        <FormLabel>Position</FormLabel>
        <HStack spacing={4}>
          <VStack flex={1}>
            <Text fontSize="sm">X: {position.x}%</Text>
            <Slider
              value={position.x}
              onChange={(x) => setPosition({ ...position, x })}
              min={0}
              max={100}
              step={1}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </VStack>
          <VStack flex={1}>
            <Text fontSize="sm">Y: {position.y}%</Text>
            <Slider
              value={position.y}
              onChange={(y) => setPosition({ ...position, y })}
              min={0}
              max={100}
              step={1}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </VStack>
        </HStack>
      </FormControl>

      <Button
        colorScheme="blue"
        onClick={applyWatermark}
        isDisabled={!text}
      >
        Apply Watermark
      </Button>
    </VStack>
  )
}