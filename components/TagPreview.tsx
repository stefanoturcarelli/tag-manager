'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { useProducts } from '@/stores/productStore';

interface TagPreviewProps {
  products?: never; // Remove products prop since we'll get it from store
}

export function TagPreview({}: TagPreviewProps) {
  const products = useProducts();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (products.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate how many tags we can fit
    const tagWidth = 130; // 130px width
    const tagHeight = 140; // 140px height (70px barcode + 70px description)
    const barcodeWidth = 120; // 120px width for barcode
    const barcodeHeight = 70; // 70px height for barcode

    const tagsPerRow = Math.floor(canvas.width / tagWidth);
    const maxRows = Math.floor(canvas.height / tagHeight);
    const maxTags = Math.min(products.length, tagsPerRow * maxRows);

    for (let i = 0; i < maxTags; i++) {
      const product = products[i];
      const row = Math.floor(i / tagsPerRow);
      const col = i % tagsPerRow;

      const x = col * tagWidth;
      const y = row * tagHeight;

      // Draw tag border
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, tagWidth, tagHeight);

      // Create barcode canvas
      const barcodeCanvas = document.createElement('canvas');
      barcodeCanvas.width = barcodeWidth;
      barcodeCanvas.height = barcodeHeight;

      try {
        JsBarcode(barcodeCanvas, product.barcode, {
          format: 'CODE128',
          width: 2,
          height: barcodeHeight - 15,
          displayValue: false,
          margin: 5,
        });

        // Draw barcode
        const barcodeX = x + (tagWidth - barcodeWidth) / 2;
        const barcodeY = y + 5;
        ctx.drawImage(
          barcodeCanvas,
          barcodeX,
          barcodeY,
          barcodeWidth,
          barcodeHeight - 15,
        );

        // Draw barcode numbers with robust wrapping
        ctx.fillStyle = '#000';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';

        const barcodeText = product.barcode;
        const barcodeMaxWidth = tagWidth - 10; // Leave some margin
        const barcodeMetrics = ctx.measureText(barcodeText);

        if (barcodeMetrics.width > barcodeMaxWidth) {
          // Use the same robust wrapping function for barcode numbers
          const barcodeLines = wrapText(barcodeText, barcodeMaxWidth, 8, 20); // Max 20px height for barcode
          let lineY = barcodeY + barcodeHeight - 5;

          for (const line of barcodeLines) {
            ctx.fillText(line, x + tagWidth / 2, lineY);
            lineY += 10; // Line height
          }
        } else {
          ctx.fillText(
            barcodeText,
            x + tagWidth / 2,
            barcodeY + barcodeHeight - 5,
          );
        }

        // Draw product information (description)
        const infoY = barcodeY + barcodeHeight + 5;
        ctx.textAlign = 'left';

        let currentY = infoY;
        const margin = 5;
        const availableHeight = tagHeight - (infoY - y) - 5; // Available space for text
        const maxWidth = tagWidth - margin * 2;

        // Use a non-null asserted ctx inside helpers to satisfy TS
        const c = ctx as CanvasRenderingContext2D;

        // Function to wrap text into multiple lines within maxHeight
        function wrapText(
          text: string,
          maxWidth: number,
          fontSize: number,
          maxHeight: number,
        ) {
          c.font = `${fontSize}px Arial`;
          const words = text.split(' ');
          const lines: string[] = [];
          let currentLine = '';
          const lineHeight = fontSize + 2;
          let currentHeight = 0;

          const pushLine = (line: string) => {
            lines.push(line);
            currentHeight += lineHeight;
          };

          for (const word of words) {
            const candidate = currentLine ? `${currentLine} ${word}` : word;

            const candidateWidth = c.measureText(candidate).width;
            if (candidateWidth <= maxWidth) {
              // It fits on the current line
              currentLine = candidate;
              continue;
            }

            // Candidate doesn't fit. First, push the current line if it has content
            if (currentLine) {
              pushLine(currentLine);
              if (currentHeight + lineHeight > maxHeight) {
                return lines; // No more vertical space
              }
              currentLine = '';
            }

            // Now place the word itself. If the single word is too long, split it by characters
            const wordWidth = c.measureText(word).width;
            if (wordWidth > maxWidth) {
              const pieces = splitLongWord(word, maxWidth, fontSize);
              for (const piece of pieces) {
                if (currentHeight + lineHeight > maxHeight) return lines;
                pushLine(piece);
              }
              currentLine = '';
            } else {
              // The word fits on a new line by itself
              currentLine = word;
            }
          }

          // Add the last line if there's space
          if (currentLine && currentHeight + lineHeight <= maxHeight) {
            pushLine(currentLine);
          }

          return lines;
        }

        // Helper function to split very long words
        function splitLongWord(
          word: string,
          maxWidth: number,
          fontSize: number,
        ) {
          c.font = `${fontSize}px Arial`;
          const lines: string[] = [];
          let currentLine = '';

          for (let i = 0; i < word.length; i++) {
            const testLine = currentLine + word[i];
            const metrics = c.measureText(testLine);

            if (metrics.width > maxWidth && currentLine) {
              lines.push(currentLine);
              currentLine = word[i];
            } else {
              currentLine = testLine;
            }
          }

          if (currentLine) {
            lines.push(currentLine);
          }

          return lines;
        }

        // Function to calculate optimal font size
        const getOptimalFontSize = (
          texts: string[],
          maxWidth: number,
          maxHeight: number,
        ) => {
          let fontSize = 8; // Start with max font size
          let fits = false;

          while (fontSize >= 4 && !fits) {
            const lineHeight = fontSize + 2;
            let totalHeight = 0;
            let allTextFits = true;

            for (const text of texts) {
              if (!text.trim()) continue;

              const lines = wrapText(
                text,
                maxWidth,
                fontSize,
                maxHeight - totalHeight,
              );
              const textHeight = lines.length * lineHeight;

              if (totalHeight + textHeight > maxHeight) {
                allTextFits = false;
                break;
              }

              totalHeight += textHeight;
            }

            if (allTextFits) {
              fits = true;
            } else {
              fontSize -= 0.5;
            }
          }

          return Math.max(fontSize, 4);
        };

        // Collect all text fields
        const textFields = [
          product.description,
          product.t2tCode ? `T2T: ${product.t2tCode}` : '',
          product.color ? `Color: ${product.color}` : '',
          product.usSize ? `US: ${product.usSize}` : '',
          product.ukSize ? `UK: ${product.ukSize}` : '',
        ].filter(Boolean);

        // Calculate optimal font size
        const optimalFontSize = getOptimalFontSize(
          textFields,
          maxWidth,
          availableHeight,
        );
        const lineHeight = optimalFontSize + 2;

        ctx.font = `${optimalFontSize}px Arial`;

        // Draw all text with wrapping
        for (const text of textFields) {
          if (!text.trim()) continue;

          const remainingHeight = y + tagHeight - currentY - 5;
          const lines = wrapText(
            text,
            maxWidth,
            optimalFontSize,
            remainingHeight,
          );

          for (const line of lines) {
            // More aggressive overflow prevention
            if (currentY + lineHeight > y + tagHeight - 5) break;
            ctx.fillText(line, x + margin, currentY);
            currentY += lineHeight;
          }
        }
      } catch (error) {
        console.error('Error generating barcode:', error);
        // Draw error text
        ctx.fillStyle = '#ff0000';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Barcode Error', x + tagWidth / 2, y + tagHeight / 2);
      }
    }
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Add products to see preview
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Tag Preview</h2>
      <div className="border rounded-lg overflow-auto max-h-96">
        <canvas ref={canvasRef} width={600} height={400} className="block" />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Showing {Math.min(products.length, 12)} of {products.length} tags
      </p>
    </div>
  );
}
