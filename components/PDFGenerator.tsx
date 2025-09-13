"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { Product } from "./TagManager";

interface PDFGeneratorProps {
  products: Product[];
}

export function PDFGenerator({ products }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Letter paper dimensions in mm
  const LETTER_WIDTH = 216; // 8.5 inches
  const LETTER_HEIGHT = 279; // 11 inches
  
  // Tag dimensions in mm
  const TAG_WIDTH = 30; // 3cm
  const TAG_HEIGHT = 45; // 4.5cm
  const BARCODE_WIDTH = 25; // 2.5cm
  const BARCODE_HEIGHT = 15; // 1.5cm
  
  // Margins
  const MARGIN = 10; // 1cm margin
  
  // Calculate how many tags fit per page
  const availableWidth = LETTER_WIDTH - (2 * MARGIN);
  const availableHeight = LETTER_HEIGHT - (2 * MARGIN);
  
  const tagsPerRow = Math.floor(availableWidth / TAG_WIDTH);
  const tagsPerColumn = Math.floor(availableHeight / TAG_HEIGHT);
  const tagsPerPage = tagsPerRow * tagsPerColumn;

  const generatePDF = async () => {
    if (products.length === 0) return;

    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
      });

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

          const x = MARGIN + (col * TAG_WIDTH);
          const y = MARGIN + (row * TAG_HEIGHT);

          // Draw tag border
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(0.1);
          pdf.rect(x, y, TAG_WIDTH, TAG_HEIGHT);

          // Generate barcode
          const barcodeCanvas = document.createElement("canvas");
          barcodeCanvas.width = 200;
          barcodeCanvas.height = 60;

          try {
            JsBarcode(barcodeCanvas, product.barcode, {
              format: "CODE128",
              width: 2,
              height: 50,
              displayValue: false,
              margin: 5,
            });

            // Convert canvas to image and add to PDF
            const barcodeDataURL = barcodeCanvas.toDataURL("image/png");
            const barcodeX = x + (TAG_WIDTH - BARCODE_WIDTH) / 2;
            const barcodeY = y + 2;
            
            pdf.addImage(
              barcodeDataURL,
              "PNG",
              barcodeX,
              barcodeY,
              BARCODE_WIDTH,
              BARCODE_HEIGHT
            );

            // Add barcode numbers
            pdf.setFontSize(6);
            pdf.setTextColor(0, 0, 0);
            pdf.text(
              product.barcode,
              x + TAG_WIDTH / 2,
              barcodeY + BARCODE_HEIGHT + 2,
              { align: "center" }
            );

            // Add product information
            let currentY = barcodeY + BARCODE_HEIGHT + 6;
            pdf.setFontSize(4);

            if (product.productName) {
              pdf.text(product.productName, x + 1, currentY);
              currentY += 3;
            }

            if (product.t2tCode) {
              pdf.text(`T2T: ${product.t2tCode}`, x + 1, currentY);
              currentY += 3;
            }

            if (product.color) {
              pdf.text(`Color: ${product.color}`, x + 1, currentY);
              currentY += 3;
            }

            if (product.usSize) {
              pdf.text(`US: ${product.usSize}`, x + 1, currentY);
              currentY += 3;
            }

            if (product.ukSize) {
              pdf.text(`UK: ${product.ukSize}`, x + 1, currentY);
            }
          } catch (error) {
            console.error("Error generating barcode for product:", product.barcode, error);
            
            // Add error text
            pdf.setFontSize(6);
            pdf.setTextColor(255, 0, 0);
            pdf.text(
              "Barcode Error",
              x + TAG_WIDTH / 2,
              y + TAG_HEIGHT / 2,
              { align: "center" }
            );
          }
        }
      }

      // Save the PDF
      pdf.save(`product-tags-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
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
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Generate PDF
      </h2>
      
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p><strong>Layout Information:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Tags per page: {tagsPerPage}</li>
            <li>Total pages: {totalPages}</li>
            <li>Tags per row: {tagsPerRow}</li>
            <li>Tag size: 3cm × 4.5cm</li>
            <li>Barcode size: 2.5cm × 1.5cm</li>
          </ul>
        </div>

        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isGenerating
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isGenerating ? "Generating PDF..." : `Generate PDF (${products.length} tags)`}
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
