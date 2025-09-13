"use client";

import { useState } from "react";
import { TagManager } from "@/components/TagManager";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tag Manager</h1>
          <p className="text-gray-600">Generate product tags with barcodes for your business</p>
        </div>
        <TagManager />
      </div>
    </div>
  );
}
