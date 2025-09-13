"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { Product } from "./TagManager";

interface TagPreviewProps {
  products: Product[];
}

export function TagPreview({ products }: TagPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (products.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate how many tags we can fit
    const tagWidth = 113; // 3cm in pixels (at 96 DPI)
    const tagHeight = 170; // 4.5cm in pixels (at 96 DPI)
    const barcodeWidth = 94; // 2.5cm in pixels
    const barcodeHeight = 57; // 1.5cm in pixels
    
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
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, tagWidth, tagHeight);

      // Create barcode canvas
      const barcodeCanvas = document.createElement("canvas");
      barcodeCanvas.width = barcodeWidth;
      barcodeCanvas.height = barcodeHeight;

      try {
        JsBarcode(barcodeCanvas, product.barcode, {
          format: "CODE128",
          width: 2,
          height: barcodeHeight - 10,
          displayValue: false,
          margin: 5,
        });

        // Draw barcode
        const barcodeX = x + (tagWidth - barcodeWidth) / 2;
        const barcodeY = y + 5;
        ctx.drawImage(barcodeCanvas, barcodeX, barcodeY, barcodeWidth, barcodeHeight - 10);

        // Draw barcode numbers
        ctx.fillStyle = "#000";
        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          product.barcode,
          x + tagWidth / 2,
          barcodeY + barcodeHeight - 5
        );

        // Draw product information
        const infoY = barcodeY + barcodeHeight + 5;
        ctx.font = "6px Arial";
        ctx.textAlign = "left";
        
        let currentY = infoY;
        const lineHeight = 8;
        const margin = 2;

        if (product.productName) {
          ctx.fillText(product.productName, x + margin, currentY);
          currentY += lineHeight;
        }
        
        if (product.t2tCode) {
          ctx.fillText(`T2T: ${product.t2tCode}`, x + margin, currentY);
          currentY += lineHeight;
        }
        
        if (product.color) {
          ctx.fillText(`Color: ${product.color}`, x + margin, currentY);
          currentY += lineHeight;
        }
        
        if (product.usSize) {
          ctx.fillText(`US: ${product.usSize}`, x + margin, currentY);
          currentY += lineHeight;
        }
        
        if (product.ukSize) {
          ctx.fillText(`UK: ${product.ukSize}`, x + margin, currentY);
        }
      } catch (error) {
        console.error("Error generating barcode:", error);
        // Draw error text
        ctx.fillStyle = "#ff0000";
        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Barcode Error", x + tagWidth / 2, y + tagHeight / 2);
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
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Tag Preview
      </h2>
      <div className="border rounded-lg overflow-auto max-h-96">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="block"
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Showing {Math.min(products.length, 12)} of {products.length} tags
      </p>
    </div>
  );
}
