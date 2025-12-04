interface ParserOption {
  id: string;
  name: string;
  description: string;
  envFlag?: string; // Environment variable to check if enabled
}

const ALL_PARSERS: ParserOption[] = [
  {
    id: 'landing_ai',
    name: 'Landing AI',
    description: 'Document parsing with grounding',
    // Always enabled - no flag needed
  },
  {
    id: 'claude_vision',
    name: 'Claude Vision',
    description: 'Vision-based document parsing',
    envFlag: 'VITE_ENABLE_CLAUDE_VISION',
  },
  {
    id: 'gemini_vision',
    name: 'Gemini Vision',
    description: 'Google Gemini vision-based parsing',
    envFlag: 'VITE_ENABLE_GEMINI_VISION',
  },
  {
    id: 'bedrock_claude',
    name: 'Bedrock Claude',
    description: 'AWS Bedrock Claude vision parsing',
    envFlag: 'VITE_ENABLE_BEDROCK_CLAUDE',
  },
];

// Filter parsers based on environment flags
const getEnabledParsers = (): ParserOption[] => {
  return ALL_PARSERS.filter(parser => {
    // Always include parsers without a flag
    if (!parser.envFlag) return true;
    // Check if the env flag is set to 'true'
    const envValue = import.meta.env[parser.envFlag];
    return envValue === 'true' || envValue === true;
  });
};

interface ParserSelectorProps {
  selectedParser: string;
  onParserChange: (parser: string) => void;
}

export default function ParserSelector({ selectedParser, onParserChange }: ParserSelectorProps) {
  const enabledParsers = getEnabledParsers();
  const currentParser = enabledParsers.find(p => p.id === selectedParser) || enabledParsers[0];

  // If only one parser is available, don't show the selector
  if (enabledParsers.length <= 1) {
    return null;
  }

  return (
    <div className="relative">
      <select
        value={selectedParser}
        onChange={(e) => onParserChange(e.target.value)}
        className="appearance-none bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-700 cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        title={`${currentParser.name}: ${currentParser.description}`}
      >
        {enabledParsers.map((parser) => (
          <option key={parser.id} value={parser.id}>
            {parser.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
