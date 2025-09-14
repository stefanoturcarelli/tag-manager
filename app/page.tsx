"use client";

import { useState } from "react";
import { TagManager } from "@/components/TagManager";
import { LogoUpload } from "@/components/LogoUpload";
import { useDebugStore } from "@/hooks/useDebugStore";
import { useCompanyLogo, useSetCompanyLogo } from "@/stores/productStore";

export default function Home() {
  // Enable debugging in development
  useDebugStore();

  const companyLogo = useCompanyLogo();
  const setCompanyLogo = useSetCompanyLogo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Company Logo"
                className="h-12 w-auto mr-4 object-contain max-w-20"
              />
            ) : (
              <div className="h-12 w-12 mr-4 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Tag Manager
              </h1>
              <p className="text-gray-600">
                Generate product tags with barcodes for your business
              </p>
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <LogoUpload onLogoChange={setCompanyLogo} currentLogo={companyLogo} />

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
