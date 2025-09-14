"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { useProducts } from "@/stores/productStore";

interface TagPreviewProps {
  products?: never; // Remove products prop since we'll get it from store
}

export function TagPreview({}: TagPreviewProps) {
  const products = useProducts();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (products.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
          height: barcodeHeight - 15,
          displayValue: false,
          margin: 5,
        });

        // Draw barcode
        const barcodeX = x + (tagWidth - barcodeWidth) / 2;
        const barcodeY = y + 5;
        ctx.drawImage(barcodeCanvas, barcodeX, barcodeY, barcodeWidth, barcodeHeight - 15);

        // Draw barcode numbers
        ctx.fillStyle = "#000";
        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          product.barcode,
          x + tagWidth / 2,
          barcodeY + barcodeHeight - 5
        );

        // Draw product information (description)
        const infoY = barcodeY + barcodeHeight + 10;
        ctx.font = "8px Arial";
        ctx.textAlign = "left";
        
        let currentY = infoY;
        const lineHeight = 10;
        const margin = 5;

        if (product.description) {
          // Split description into multiple lines if too long
          const words = product.description.split(' ');
          let line = '';
          const maxWidth = tagWidth - (margin * 2);
          
          for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
              ctx.fillText(line, x + margin, currentY);
              currentY += lineHeight;
              line = word + ' ';
            } else {
              line = testLine;
            }
          }
          if (line) {
            ctx.fillText(line, x + margin, currentY);
            currentY += lineHeight;
          }
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
