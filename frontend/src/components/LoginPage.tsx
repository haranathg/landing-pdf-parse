import { useState } from 'react';
import { validateAccessKey, setAuthenticated } from '../utils/auth';
import urbancompassLogo from '../assets/urbancompass.png';

interface LoginPageProps {
  onAuthenticated: () => void;
}

export default function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsValidating(true);

    // Small delay to prevent brute force
    await new Promise(resolve => setTimeout(resolve, 500));

    if (validateAccessKey(accessKey)) {
      setAuthenticated();
      onAuthenticated();
    } else {
      setError('Invalid access key. Please check and try again.');
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 border border-[#D1D5DB]">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={urbancompassLogo}
            alt="UrbanCompass"
            className="h-16 object-contain mb-6"
          />
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#1e293b]">
              CompliCheck<span className="text-[#046bd2]">AI</span>
            </h1>
            <p className="text-sm text-[#334155] mt-1">
              Document Compliance Studio
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-[#334155] text-sm leading-relaxed">
            AI-powered document compliance checking for building consent applications.
          </p>
          <p className="text-[#9CA3AF] text-xs mt-3">
            Enter your access key to continue.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="accessKey" className="block text-sm font-medium text-[#334155] mb-2">
              Access Key
            </label>
            <input
              type="password"
              id="accessKey"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Enter your access key"
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded focus:ring-2 focus:ring-[#046bd2] focus:border-[#046bd2] outline-none transition-all text-[#1e293b] placeholder-[#9CA3AF]"
              disabled={isValidating}
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!accessKey.trim() || isValidating}
            className="w-full py-3 bg-[#046bd2] text-white rounded font-medium hover:bg-[#045cb4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Validating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#D1D5DB] text-center">
          <p className="text-xs text-[#9CA3AF]">
            Need access? Contact your administrator.
          </p>
          <p className="text-xs text-[#9CA3AF] mt-2">
            Powered by <a href="https://urbancompasssoftware.com" target="_blank" rel="noopener noreferrer" className="text-[#046bd2] hover:underline">UrbanCompass</a>
          </p>
        </div>
      </div>
    </div>
  );
}
