'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';

interface LogoUploadProps {
  onLogoChange: (logoUrl: string | null) => void;
  currentLogo?: string | null;
}

export function LogoUpload({ onLogoChange, currentLogo }: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error(
        'Invalid File',
        'Please select an image file (PNG, JPG, GIF, etc.)',
      );
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error('File Too Large', 'Please select an image smaller than 5MB');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onLogoChange(result);
      success('Logo Updated', 'Company logo has been uploaded successfully');
      setIsExpanded(false); // Collapse after successful upload
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onLogoChange(null);
    success('Logo Removed', 'Company logo has been removed');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm mb-4 transition-all duration-200 ${
        isExpanded ? 'p-6' : 'p-3'
      }`}
    >
      <div className="flex items-center justify-between">
        {!isExpanded ? (
          // Compact view
          <div className="flex items-center space-x-3">
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Company logo"
                  className="w-8 h-8 object-contain rounded border border-gray-200"
                />
                <button
                  onClick={handleRemove}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove logo"
                >
                  <svg
                    className="w-2 h-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-400"
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
              <h3 className="text-sm font-medium text-gray-700">
                Company Branding
              </h3>
              <p className="text-xs text-gray-500">
                {preview ? 'Logo uploaded' : 'No logo set'}
              </p>
            </div>
          </div>
        ) : (
          // Expanded view header
          <h2 className="text-xl font-semibold text-gray-900">
            Company Branding
          </h2>
        )}

        <button
          onClick={toggleExpanded}
          className={`inline-flex items-center transition-colors ${
            isExpanded
              ? 'px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
              : 'px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded'
          }`}
        >
          {isExpanded ? (
            <>
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Hide
            </>
          ) : (
            <>
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </>
          )}
        </button>
      </div>

      {/* Logo Display - Only in expanded mode */}
      {isExpanded && preview && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <img
              src={preview}
              alt="Company logo"
              className="w-16 h-16 object-contain rounded-lg border border-gray-200"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="Remove logo"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Company Logo</p>
            <p className="text-xs text-gray-500">
              Click Edit to change or remove
            </p>
          </div>
        </div>
      )}

      {/* Collapsible Upload Form */}
      {isExpanded && (
        <div className="space-y-4">
          <div className="flex items-center space-x-6">
            {/* Logo Preview/Upload Area */}
            <div
              className={`
                relative w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
                ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }
                ${preview ? 'border-solid' : ''}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              {preview ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview}
                    alt="Company logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                  <svg
                    className="w-8 h-8 mb-1"
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
                  <span className="text-xs text-center">Upload Logo</span>
                </div>
              )}
            </div>

            {/* Upload Instructions */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Company Logo
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Upload your company logo to customize the interface and
                generated tags.
              </p>
              <div className="space-y-2">
                <button
                  onClick={handleClick}
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Choose File
                </button>
                <p className="text-xs text-gray-500">
                  Drag & drop or click to upload. Max 5MB. PNG, JPG, GIF
                  supported.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />
    </div>
  );
}
