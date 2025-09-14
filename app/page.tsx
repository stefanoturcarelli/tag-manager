'use client';

import { useState } from 'react';
import { TagManager } from '@/components/TagManager';
import { useDebugStore } from '@/hooks/useDebugStore';
import { useCompanyLogo } from '@/stores/productStore';
import Link from 'next/link';

export default function Home() {
  // Enable debugging in development
  useDebugStore();

  const companyLogo = useCompanyLogo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logo and Settings */}
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

          {/* Settings Link */}
          <div className="flex justify-center">
            <Link
              href="/settings"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </Link>
          </div>
        </div>

        <TagManager />

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
