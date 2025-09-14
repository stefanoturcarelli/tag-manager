"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { useProducts, useCompanyLogo } from "@/stores/productStore";
import { useToast } from "@/contexts/ToastContext";

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
      warning("No Products", "Please add some products before generating PDF");
      return;
    }

    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
      });

      // Add company logo to first page if available
      if (companyLogo) {
        try {
          pdf.addImage(
            companyLogo,
            "PNG",
            10, // x position
            10, // y position
            30, // width
            15, // height
            undefined,
            "FAST"
          );
        } catch (err) {
          console.warn("Could not add company logo to PDF:", err);
        }
      }

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
          const barcodeCanvas = document.createElement("canvas");
          barcodeCanvas.width = 240; // Higher resolution for better quality
          barcodeCanvas.height = 140;

          try {
            JsBarcode(barcodeCanvas, product.barcode, {
              format: "CODE128",
              width: 2,
              height: 120,
              displayValue: false,
              margin: 5,
            });

            // Convert canvas to image and add to PDF
            const barcodeDataURL = barcodeCanvas.toDataURL("image/png");
            const barcodeX = x + (TAG_WIDTH - BARCODE_WIDTH) / 2;
            const barcodeY = y + 1;

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

            // Add product information (description)
            let currentY = barcodeY + BARCODE_HEIGHT + 10;
            pdf.setFontSize(8);

            if (product.description) {
              // Split description into multiple lines if too long
              const words = product.description.split(" ");
              let line = "";
              const maxWidth = TAG_WIDTH - 2;

              for (const word of words) {
                const testLine = line + word + " ";
                const textWidth = pdf.getTextWidth(testLine);
                if (textWidth > maxWidth && line !== "") {
                  pdf.text(line, x + 1, currentY);
                  currentY += 3;
                  line = word + " ";
                } else {
                  line = testLine;
                }
              }
              if (line) {
                pdf.text(line, x + 1, currentY);
                currentY += 3;
              }
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
            console.error(
              "Error generating barcode for product:",
              product.barcode,
              error
            );

            // Add error text
            pdf.setFontSize(6);
            pdf.setTextColor(255, 0, 0);
            pdf.text("Barcode Error", x + TAG_WIDTH / 2, y + TAG_HEIGHT / 2, {
              align: "center",
            });
          }
        }
      }

      // Save the PDF
      pdf.save(`product-tags-${new Date().toISOString().split("T")[0]}.pdf`);

      // Show success toast
      success(
        "PDF Generated!",
        `Successfully generated PDF with ${products.length} tags`
      );
    } catch (err) {
      console.error("Error generating PDF:", err);
      error(
        "PDF Generation Failed",
        "An error occurred while generating the PDF. Please try again."
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
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isGenerating
            ? "Generating PDF..."
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
