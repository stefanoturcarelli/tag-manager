'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import { useProducts, useCompanyLogo } from '@/stores/productStore';
import { useToast } from '@/contexts/ToastContext';

interface PDFGeneratorProps {
  products?: never; // Remove products prop since we'll get it from store
}

export function PDFGenerator({}: PDFGeneratorProps) {
  const products = useProducts();
  const companyLogo = useCompanyLogo();
  const [isGenerating, setIsGenerating] = useState(false);
  const { success, error, warning } = useToast();

  // Letter paper dimensions in mm
  const LETTER_WIDTH = 216; // 8.5 inches
  const LETTER_HEIGHT = 279; // 11 inches

  // Tag dimensions in mm (converted from 130px x 140px at 96 DPI)
  const TAG_WIDTH = 34.4; // 130px = 34.4mm
  const TAG_HEIGHT = 37.0; // 140px = 37.0mm
  const BARCODE_WIDTH = 31.8; // 120px = 31.8mm
  const BARCODE_HEIGHT = 18.5; // 70px = 18.5mm

  // Margins
  const MARGIN = 10; // 1cm margin

  // Calculate how many tags fit per page
  const availableWidth = LETTER_WIDTH - 2 * MARGIN;
  const availableHeight = LETTER_HEIGHT - 2 * MARGIN;

  const tagsPerRow = Math.floor(availableWidth / TAG_WIDTH);
  const tagsPerColumn = Math.floor(availableHeight / TAG_HEIGHT);
  const tagsPerPage = tagsPerRow * tagsPerColumn;

  const generatePDF = async () => {
    if (products.length === 0) {
      warning('No Products', 'Please add some products before generating PDF');
      return;
    }

    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
      });

      // Do not add company logo to PDF pages

      const totalPages = Math.ceil(products.length / tagsPerPage);

      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const startIndex = pageIndex * tagsPerPage;
        const endIndex = Math.min(startIndex + tagsPerPage, products.length);
        const pageProducts = products.slice(startIndex, endIndex);

        for (let i = 0; i < pageProducts.length; i++) {
          const product = pageProducts[i];
          const row = Math.floor(i / tagsPerRow);
          const col = i % tagsPerRow;

          const x = MARGIN + col * TAG_WIDTH;
          const y = MARGIN + row * TAG_HEIGHT;

          // Draw tag border
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.1);
          pdf.rect(x, y, TAG_WIDTH, TAG_HEIGHT);

          // Generate barcode
          const barcodeCanvas = document.createElement('canvas');
          barcodeCanvas.width = 240; // Higher resolution for better quality
          barcodeCanvas.height = 140;

          try {
            JsBarcode(barcodeCanvas, product.barcode, {
              format: 'CODE128',
              width: 2,
              height: 120,
              displayValue: false,
              margin: 5,
            });

            // Convert canvas to image and add to PDF
            const barcodeDataURL = barcodeCanvas.toDataURL('image/png');
            const barcodeX = x + (TAG_WIDTH - BARCODE_WIDTH) / 2;
            const barcodeY = y + 1;

            pdf.addImage(
              barcodeDataURL,
              'PNG',
              barcodeX,
              barcodeY,
              BARCODE_WIDTH,
              BARCODE_HEIGHT,
            );

            // Helper functions (defined before first use)
            function wrapTextPDF(
              text: string,
              maxWidth: number,
              fontSize: number,
              maxHeight: number,
            ): string[] {
              pdf.setFontSize(fontSize);
              const words = text.split(' ');
              const lines: string[] = [];
              let currentLine = '';
              const lineHeight = fontSize * 0.4; // PDF line height multiplier
              let currentHeight = 0;

              const pushLine = (line: string) => {
                lines.push(line);
                currentHeight += lineHeight;
              };

              for (const word of words) {
                const candidate = currentLine ? `${currentLine} ${word}` : word;
                const candidateWidth = pdf.getTextWidth(candidate);

                if (candidateWidth <= maxWidth) {
                  currentLine = candidate;
                  continue;
                }

                if (currentLine) {
                  pushLine(currentLine);
                  if (currentHeight + lineHeight > maxHeight) return lines;
                  currentLine = '';
                }

                const wordWidth = pdf.getTextWidth(word);
                if (wordWidth > maxWidth) {
                  const pieces = splitLongWordPDF(word, maxWidth, fontSize);
                  for (const piece of pieces) {
                    if (currentHeight + lineHeight > maxHeight) return lines;
                    pushLine(piece);
                  }
                  currentLine = '';
                } else {
                  currentLine = word;
                }
              }

              if (currentLine && currentHeight + lineHeight <= maxHeight) {
                pushLine(currentLine);
              }

              return lines;
            }

            function splitLongWordPDF(
              word: string,
              maxWidth: number,
              fontSize: number,
            ): string[] {
              pdf.setFontSize(fontSize);
              const lines: string[] = [];
              let currentLine = '';

              for (let i = 0; i < word.length; i++) {
                const testLine = currentLine + word[i];
                const textWidth = pdf.getTextWidth(testLine);

                if (textWidth > maxWidth && currentLine) {
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

            // Add barcode numbers with robust wrapping
            pdf.setFontSize(6);
            pdf.setTextColor(0, 0, 0);
            const MM_PER_PT = 0.352778; // mm per point
            const LINE_HEIGHT_FACTOR = 1.25; // approximate canvas 8px -> 10px
            const BARCODE_TEXT_FONT = 6;
            const BARCODE_TEXT_LINE_HEIGHT =
              BARCODE_TEXT_FONT * MM_PER_PT * LINE_HEIGHT_FACTOR;

            const barcodeText = product.barcode;
            const barcodeMaxWidth = TAG_WIDTH - 2; // Leave some margin
            const barcodeTextWidth = pdf.getTextWidth(barcodeText);

            let afterBarcodeTextY = barcodeY + BARCODE_HEIGHT + 1.2; // default fallback

            if (barcodeTextWidth > barcodeMaxWidth) {
              // Use the same robust wrapping function for barcode numbers
              const barcodeLines = wrapTextPDF(
                barcodeText,
                barcodeMaxWidth,
                6,
                5,
              ); // Max 5mm height for barcode
              let lineY = barcodeY + BARCODE_HEIGHT + 1.2;

              for (const line of barcodeLines) {
                pdf.text(line, x + TAG_WIDTH / 2, lineY, {
                  align: 'center',
                });
                lineY += BARCODE_TEXT_LINE_HEIGHT; // Line height for PDF
              }

              afterBarcodeTextY = lineY + 0.1; // small extra gap
            } else {
              const singleLineY = barcodeY + BARCODE_HEIGHT + 1.2;
              pdf.text(barcodeText, x + TAG_WIDTH / 2, singleLineY, {
                align: 'center',
              });
              afterBarcodeTextY = singleLineY + BARCODE_TEXT_LINE_HEIGHT + 0.1;
            }

            // Add product information (description)
            let currentY = afterBarcodeTextY;
            const maxWidth = TAG_WIDTH - 2;
            const availableHeight = TAG_HEIGHT - (currentY - y) - 0.5; // Available space for text

            // Function to calculate optimal font size for PDF
            const getOptimalFontSizePDF = (
              texts: string[],
              maxWidth: number,
              maxHeight: number,
            ) => {
              let fontSize = 6; // Start at ~8px canvas equivalent
              let fits = false;

              while (fontSize >= 3 && !fits) {
                const lineHeight = fontSize * MM_PER_PT * LINE_HEIGHT_FACTOR; // mm per pt * leading
                let totalHeight = 0;
                let allTextFits = true;

                for (const text of texts) {
                  if (!text.trim()) continue;

                  const lines = wrapTextPDF(
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

              return Math.max(fontSize, 3);
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
            const optimalFontSize = getOptimalFontSizePDF(
              textFields,
              maxWidth,
              availableHeight,
            );
            const lineHeight = optimalFontSize * MM_PER_PT * LINE_HEIGHT_FACTOR; // PDF line height in mm

            pdf.setFontSize(optimalFontSize);

            // Draw all text with wrapping
            for (const text of textFields) {
              if (!text.trim()) continue;

              const remainingHeight = y + TAG_HEIGHT - currentY - 0.5;
              const lines = wrapTextPDF(
                text,
                maxWidth,
                optimalFontSize,
                remainingHeight,
              );

              for (const line of lines) {
                // More aggressive overflow prevention
                if (currentY + lineHeight > y + TAG_HEIGHT - 0.5) break;
                pdf.text(line, x + 1, currentY);
                currentY += lineHeight;
              }
            }
          } catch (error) {
            console.error(
              'Error generating barcode for product:',
              product.barcode,
              error,
            );

            // Add error text
            pdf.setFontSize(6);
            pdf.setTextColor(255, 0, 0);
            pdf.text('Barcode Error', x + TAG_WIDTH / 2, y + TAG_HEIGHT / 2, {
              align: 'center',
            });
          }
        }
      }

      // Save the PDF
      pdf.save(`product-tags-${new Date().toISOString().split('T')[0]}.pdf`);

      // Show success toast
      success(
        'PDF Generated!',
        `Successfully generated PDF with ${products.length} tags`,
      );
    } catch (err) {
      console.error('Error generating PDF:', err);
      error(
        'PDF Generation Failed',
        'An error occurred while generating the PDF. Please try again.',
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (products.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(products.length / tagsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate PDF</h2>

      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>
            <strong>Layout Information:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Tags per page: {tagsPerPage}</li>
            <li>Total pages: {totalPages}</li>
            <li>Tags per row: {tagsPerRow}</li>
            <li>Tag size: 130px × 140px (34.4mm × 37.0mm)</li>
            <li>Barcode size: 120px × 70px (31.8mm × 18.5mm)</li>
          </ul>
        </div>

        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isGenerating
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isGenerating
            ? 'Generating PDF...'
            : `Generate PDF (${products.length} tags)`}
        </button>

        {isGenerating && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <p className="text-sm text-gray-600 mt-2">Please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
}
