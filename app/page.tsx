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
        
        {/* Copyright Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://stefanoturcarelli.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Stefano Turcarelli
            </a>
            . All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
