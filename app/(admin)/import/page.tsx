'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Code, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [method, setMethod] = useState<'file' | 'paste'>('file');
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState<any>(null);
  const [fileName, setFileName] = useState('');

  // Parse and validate JSON
  const parseJSON = (jsonStr: string): any => {
    try {
      const parsed = JSON.parse(jsonStr);
      validateSchema(parsed);
      return parsed;
    } catch (e: any) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }
  };

  // Validate required fields
  const validateSchema = (data: any) => {
    if (!data.clinic?.name?.trim()) {
      throw new Error('Missing required field: clinic.name');
    }
    if (!data.clinic?.address?.full?.trim()) {
      throw new Error('Missing required field: clinic.address.full');
    }
    if (!data.clinic?.contact?.phone?.trim()) {
      throw new Error('Missing required field: clinic.contact.phone');
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      try {
        const data = parseJSON(content);
        setPreview(data);
        setError('');
      } catch (err: any) {
        setError(err.message);
        setPreview(null);
      }
    };
    reader.readAsText(file);
  };

  // Handle paste input
  const handlePaste = () => {
    if (!jsonInput.trim()) {
      setError('Please paste JSON data');
      return;
    }

    try {
      const data = parseJSON(jsonInput);
      setPreview(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setPreview(null);
    }
  };

  // Submit import
  const handleImport = async () => {
    if (!preview) {
      setError('Please provide valid JSON data first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceData: preview }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || 'Import failed');
      }

      setSuccess(`✓ Clinic imported successfully!`);
      setTimeout(() => {
        router.push(`/admin/edit/${result.slug}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear all
  const handleClear = () => {
    setJsonInput('');
    setPreview(null);
    setError('');
    setSuccess('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-green-600 hover:text-green-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">📥 Import Clinic Data</h1>
          <p className="text-slate-600">Upload a JSON file downloaded from the Chrome extension or paste the JSON directly</p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Method Selection */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setMethod('file');
                handleClear();
              }}
              className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                method === 'file'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Upload className="inline mr-2" size={20} />
              Upload File
            </button>
            <button
              onClick={() => {
                setMethod('paste');
                handleClear();
              }}
              className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                method === 'paste'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Code className="inline mr-2" size={20} />
              Paste JSON
            </button>
          </div>

          {/* File Upload */}
          {method === 'file' && (
            <div className="mb-8">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <Upload size={48} className="mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-semibold">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-500 mt-1">JSON files only • downloaded from Chrome extension</p>
                  {fileName && (
                    <p className="text-green-600 mt-2 font-semibold">📄 {fileName}</p>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Paste JSON */}
          {method === 'paste' && (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Paste JSON Data
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste the JSON content from the downloaded file...'
                className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handlePaste}
                disabled={!jsonInput.trim()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Parse JSON
              </button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-green-900">Success</p>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="mb-8 bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">📋 Preview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Clinic Name</p>
                  <p className="font-semibold text-slate-900">{preview.clinic?.name}</p>
                </div>
                <div>
                  <p className="text-slate-600">Rating</p>
                  <p className="font-semibold text-slate-900">⭐ {preview.business?.rating}</p>
                </div>
                <div>
                  <p className="text-slate-600">Phone</p>
                  <p className="font-semibold text-slate-900">{preview.clinic?.contact?.phone}</p>
                </div>
                <div>
                  <p className="text-slate-600">Reviews</p>
                  <p className="font-semibold text-slate-900">{preview.reviews?.length || 0}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-600">Address</p>
                  <p className="font-semibold text-slate-900">{preview.clinic?.address?.full}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-600">Photos</p>
                  <p className="font-semibold text-slate-900">
                    {(preview.media?.clinicImages?.length || 0) +
                      (preview.media?.treatmentImages?.length || 0) +
                      (preview.media?.otherImages?.length || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-between items-center">
            <button
              onClick={handleClear}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300"
            >
              Clear
            </button>
            <button
              onClick={handleImport}
              disabled={!preview || loading}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Confirm & Import
                </>
              )}
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📖 How to use</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-900 text-sm">
            <li>Download JSON from Chrome extension (3 manual steps to extract data)</li>
            <li>Upload the file here or paste the JSON content</li>
            <li>Review the preview to ensure data looks correct</li>
            <li>Click "Confirm & Import" to create/update the clinic</li>
            <li>You'll be redirected to edit page to customize further</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
