import {
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ColorPicker,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb
} from '@chakra-ui/react'
import { useState, useRef, useCallback } from 'react'
import { Select } from '@chakra-ui/react'
import { Radio, RadioGroup } from '@chakra-ui/react'
import { Box, Switch } from '@chakra-ui/react'

const memeTemplates = [
  { top: "ONE DOES NOT SIMPLY", bottom: "WALK INTO MORDOR" },
  { top: "I DON'T ALWAYS TEST MY CODE", bottom: "BUT WHEN I DO, I DO IT IN PRODUCTION" },
  { top: "SHUT UP AND", bottom: "TAKE MY MONEY" },
  { top: "KEEP CALM", bottom: "AND CARRY ON CODING" },
  { top: "WHAT IF I TOLD YOU", bottom: "BUGS ARE JUST UNEXPECTED FEATURES" },
  { top: "BRACE YOURSELF", bottom: "DEPLOYMENT IS COMING" },
  { top: "THIS IS", bottom: "SPARTA.JS" },
  { top: "Y U NO", bottom: "USE TYPESCRIPT?" }
];

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const words = text.split(' ');
  let line = '';
  const lines = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  
  lines.push(line);
  return lines;
};

export function MemePanel({ image, setEditedImage }: MemePanelProps) {
  const [topText, setTopText] = useState('')
  const [middleText, setMiddleText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [fontSize, setFontSize] = useState(48)
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [outlineWidth, setOutlineWidth] = useState(0.125)
  const [topOffset, setTopOffset] = useState(0)
  const [bottomOffset, setBottomOffset] = useState(0)
  const [middleOffset, setMiddleOffset] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const toast = useToast()
  const [textStyle, setTextStyle] = useState('normal')
  const [textAlign, setTextAlign] = useState('center')
  const [textShadow, setTextShadow] = useState(false)
  const [shadowColor, setShadowColor] = useState('#000000')

  const drawMemeCanvas = useCallback((canvas: HTMLCanvasElement, imgSrc: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Configure text style
      ctx.fillStyle = textColor;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = fontSize * outlineWidth;
      ctx.font = `${textStyle} ${fontSize}px "Impact", "Haettenschweiler", "Arial Black", "Arial Bold", "Franklin Gothic Heavy", "Helvetica Inserat", "AvenirNext-Heavy", "Roboto Black", "Helvetica Neue Black", sans-serif`;
      ctx.textAlign = textAlign;

      // Configure shadow if enabled
      if (textShadow) {
        ctx.shadowOffsetX = fontSize / 20;
        ctx.shadowOffsetY = fontSize / 20;
        ctx.shadowBlur = fontSize / 10;
        ctx.shadowColor = shadowColor;
      } else {
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      }

      // Calculate dynamic margins
      const minMarginRatio = 0.05;
      const maxMarginRatio = 0.15;
      const fontSizeRatio = fontSize / canvas.height;
      
      const verticalMargin = Math.min(
        Math.max(
          canvas.height * minMarginRatio,
          fontSize * 1.2,
          canvas.height * fontSizeRatio * 2
        ),
        canvas.height * maxMarginRatio
      );

      // Draw top text
      if (topText) {
        ctx.textBaseline = 'top';
        const topY = verticalMargin + topOffset;
        const lines = wrapText(ctx, topText, canvas.width * 0.9);
        
        lines.forEach((line, index) => {
          const y = topY + (index * fontSize * 1.1);
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }

      // Draw middle text
      if (middleText) {
        ctx.textBaseline = 'middle';
        const middleY = canvas.height / 2 + middleOffset;
        const lines = wrapText(ctx, middleText, canvas.width * 0.9);
        
        lines.forEach((line, index) => {
          const y = middleY + ((index - (lines.length - 1) / 2) * fontSize * 1.1);
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }

      // Draw bottom text
      if (bottomText) {
        ctx.textBaseline = 'bottom';
        const lines = wrapText(ctx, bottomText, canvas.width * 0.9);
        const bottomY = canvas.height - verticalMargin + bottomOffset;
        
        lines.forEach((line, index) => {
          const y = bottomY - (lines.length - 1 - index) * fontSize * 1.1;
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }
    };
    img.src = imgSrc;
  }, [topText, middleText, bottomText, fontSize, textColor, outlineWidth, topOffset, middleOffset, bottomOffset, textStyle, textAlign, textShadow, shadowColor]);

  const [hasGenerated, setHasGenerated] = useState(false)

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'meme-' + new Date().getTime() + '.png';
    link.href = canvas.toDataURL(image.file.type);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [image.file.type]);

  const handleGenerate = useCallback(async () => {
    try {
      setGenerating(true);
      const canvas = canvasRef.current;
      if (!canvas) {
        toast({
          title: 'Error generating meme',
          description: 'Canvas not initialized',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
        return;
      }

      drawMemeCanvas(canvas, image.preview);
      const result = canvas.toDataURL(image.file.type);
      setEditedImage(result);
      setHasGenerated(true);

      toast({
        title: 'Meme generated',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error generating meme:', error);
      toast({
        title: 'Error generating meme',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    } finally {
      setGenerating(false);
    }
  }, [image.preview, image.file.type, drawMemeCanvas, toast]);

  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>Meme Templates</FormLabel>
        <Select 
          placeholder="Select a template" 
          onChange={(e) => {
            if (e.target.value) {
              const template = memeTemplates[parseInt(e.target.value)];
              setTopText(template.top);
              setBottomText(template.bottom);
              setMiddleText('');
            }
          }}
        >
          {memeTemplates.map((template, index) => (
            <option key={index} value={index}>
              {template.top} / {template.bottom}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Top Text</FormLabel>
        <Input
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          placeholder="Enter top text"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Middle Text</FormLabel>
        <Input
          value={middleText}
          onChange={(e) => setMiddleText(e.target.value)}
          placeholder="Enter middle text"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Bottom Text</FormLabel>
        <Input
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          placeholder="Enter bottom text"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Font Size</FormLabel>
        <NumberInput
          value={fontSize}
          onChange={(_, value) => setFontSize(value)}
          min={20}
          max={100}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>Text Color</FormLabel>
        <Input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Outline Thickness</FormLabel>
        <Slider
          min={0}
          max={0.3}
          step={0.025}
          value={outlineWidth}
          onChange={(v) => setOutlineWidth(v)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl>
        <FormLabel>Top Text Position Adjustment</FormLabel>
        <Slider
          min={-50}
          max={50}
          value={topOffset}
          onChange={(v) => setTopOffset(v)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl>
        <FormLabel>Middle Text Position Adjustment</FormLabel>
        <Slider
          min={-50}
          max={50}
          value={middleOffset}
          onChange={(v) => setMiddleOffset(v)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl>
        <FormLabel>Bottom Text Position Adjustment</FormLabel>
        <Slider
          min={-50}
          max={50}
          value={bottomOffset}
          onChange={(v) => setBottomOffset(v)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">Text Shadow</FormLabel>
        <Switch isChecked={textShadow} onChange={(e) => setTextShadow(e.target.checked)} />
        {textShadow && (
          <Input
            type="color"
            value={shadowColor}
            onChange={(e) => setShadowColor(e.target.value)}
            ml={2}
            w="60px"
          />
        )}
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">Show Preview</FormLabel>
        <Switch isChecked={showPreview} onChange={(e) => setShowPreview(e.target.checked)} />
      </FormControl>

      {showPreview && (
        <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={2}>
          <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />
        </Box>
      )}

      <HStack spacing={4} width="100%">
        <Button
          colorScheme="blue"
          onClick={handleGenerate}
          isLoading={generating}
          loadingText="Generating"
          flex={1}
        >
          Generate Meme
        </Button>
        <Button
          colorScheme="green"
          onClick={handleDownload}
          isDisabled={!hasGenerated}
          flex={1}
        >
          Download
        </Button>
      </HStack>
    </VStack>
  )
}