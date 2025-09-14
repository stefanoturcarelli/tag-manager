'use client';

import { useState } from 'react';
import { LogoUpload } from '@/components/LogoUpload';
import { useDebugStore } from '@/hooks/useDebugStore';
import { useCompanyLogo, useSetCompanyLogo } from '@/stores/productStore';
import Link from 'next/link';

export default function Settings() {
  // Enable debugging in development
  useDebugStore();

  const companyLogo = useCompanyLogo();
  const setCompanyLogo = useSetCompanyLogo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
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
                Settings
              </h1>
              <p className="text-gray-600">
                Manage your application preferences
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Tag Manager
            </Link>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="max-w-4xl mx-auto">
          <LogoUpload onLogoChange={setCompanyLogo} currentLogo={companyLogo} />

          {/* Additional Settings Sections */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Application Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Auto-save
                  </h3>
                  <p className="text-sm text-gray-500">
                    Automatically save your work
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Show success and error messages
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Debug Mode
                  </h3>
                  <p className="text-sm text-gray-500">
                    Enable development tools (dev only)
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={process.env.NODE_ENV === 'development'}
                    disabled={process.env.NODE_ENV !== 'development'}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              About Tag Manager
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Tag Manager is a professional tool for generating product tags
                with barcodes. Create, manage, and print product labels
                efficiently for your business.
              </p>
              <p>
                <strong>Version:</strong> 1.0.0
                <br />
                <strong>Built with:</strong> Next.js, React, TypeScript,
                Tailwind CSS
                <br />
                <strong>Barcode Format:</strong> Code-128
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()}{' '}
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
