
import React, { useState, useCallback, useMemo } from 'react';
import { Card } from './Card'; // Corrected path
import { askStrategicQuestion } from '../../services/geminiService';
import { ArrowPathIcon, XMarkIcon, ExternalLinkIcon } from '../icons';
import type { GroundingChunk } from '../../types';

const STRATEGIC_KEYWORDS = [
  "trade", "economy", "economic", "security", "diplomacy", "diplomatic", "relations",
  "policy", "geopolitical", "analysis", "analyze", "assessment", "impact", "implications",
  "EU", "European Union", "Pakistan", "Pakistani", "Hungary", "Hungarian",
  "investment", "sanctions", "agreement", "summit", "negotiation", "conflict",
  "cooperation", "development", "strategy", "narrative", "sentiment", "trends",
  "cybersecurity", "migration", "energy", "climate change", "human rights"
];

// Helper to format source display
const formatSourceDisplay = (originalTitle: string, uri: string): { mainTitle: string, sourceName?: string } => {
  let title = originalTitle;
  let sourceName: string | undefined;

  const knownOutletsShort = ["AP", "BBC", "CNN", "DW", "FT", "NPR", "WSJ"];
  const knownOutletsLong = [
    "AP News", "Associated Press", "Reuters", "BBC News", "CNN", "The New York Times", "NY Times", "The Guardian", 
    "Al Jazeera", "France 24", "Deutsche Welle", "Politico", "Politico Europe", "Bloomberg", 
    "Financial Times", "Wall Street Journal", "Fox News", "MSNBC", "NPR", "Sky News", 
    "The Times", "The Telegraph", "Washington Post", "USA Today", "Forbes", "CNBC",
    "EUobserver", "Euronews", "DAWN.COM", "The Express Tribune" // Added from user example
  ];
  
  const titleSeparators = /\s*[|–—-]\s*/; 
  const parts = title.split(titleSeparators);
  if (parts.length > 1) {
    const potentialSourceName = parts[parts.length - 1].trim();
    if (knownOutletsLong.some(outlet => potentialSourceName.toLowerCase().includes(outlet.toLowerCase()))) {
      sourceName = potentialSourceName;
      title = parts.slice(0, -1).join(' ').trim();
    }
  }

  if (!sourceName) {
    try {
      const url = new URL(uri);
      let hostname = url.hostname.replace(/^www\./, '');
      const domainMap: Record<string, string> = {
        'apnews.com': 'AP News', 'reuters.com': 'Reuters', 'bbc.com': 'BBC News', 'bbc.co.uk': 'BBC News',
        'cnn.com': 'CNN', 'nytimes.com': 'The New York Times', 'theguardian.com': 'The Guardian',
        'aljazeera.com': 'Al Jazeera', 'france24.com': 'France 24', 'dw.com': 'Deutsche Welle',
        'politico.com': 'Politico', 'politico.eu': 'Politico Europe', 'bloomberg.com': 'Bloomberg', 'ft.com': 'Financial Times',
        'wsj.com': 'Wall Street Journal', 'foxnews.com': 'Fox News', 'msnbc.com': 'MSNBC',
        'npr.org': 'NPR', 'skynews.com': 'Sky News', 'thetimes.co.uk': 'The Times',
        'telegraph.co.uk': 'The Telegraph', 'washingtonpost.com': 'Washington Post',
        'usatoday.com': 'USA Today', 'forbes.com': 'Forbes', 'cnbc.com': 'CNBC',
        'euobserver.com': 'EUobserver', 'euronews.com': 'Euronews',
        'dawn.com': 'DAWN.COM', 'tribune.com.pk': 'The Express Tribune' // Added from user example
      };
      if (domainMap[hostname]) {
        sourceName = domainMap[hostname];
      } else {
        const domainParts = hostname.split('.');
        if (domainParts.length > 0) {
           let potentialName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
           if (knownOutletsShort.includes(potentialName.toUpperCase()) && domainMap[hostname]) {
                sourceName = domainMap[hostname];
           } else if (potentialName.length > 2) {
                sourceName = potentialName;
           }
        }
      }
    } catch (e) {
      console.warn("Could not parse URI for source name:", uri, e);
    }
  }
  
  if (sourceName && originalTitle.toLowerCase().includes(sourceName.toLowerCase())) {
      const newTitle = originalTitle.replace(new RegExp(`\\s*[|–—-]?\\s*${sourceName}\\s*$`, 'i'), '').trim();
      if (newTitle && newTitle.length < originalTitle.length - 2) {
          title = newTitle;
      }
  }

  return { mainTitle: title, sourceName: sourceName };
};


export const AIStrategicAssistantCard: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [sources, setSources] = useState<GroundingChunk[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskQuestion = useCallback(async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      setResponse('');
      setSources(undefined);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await askStrategicQuestion(question);
      setResponse(result.text);
      if (result.sources && result.sources.length > 0) {
        setSources(result.sources);
      } else {
        setSources(undefined);
      }
    } catch (err) {
      console.error("AI Assistant Error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setResponse(`Failed to get response: ${errorMessage}`);
      setSources(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [question]);

  const handleClear = useCallback(() => {
    setQuestion('');
    setResponse('');
    setSources(undefined);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleTopicClick = useCallback((topic: string) => {
    setQuestion(topic);
    // Optionally, trigger handleAskQuestion directly or let user click submit
    // handleAskQuestion(); // If you want it to auto-submit
  }, []);

  const renderClickableResponse = (text: string) => {
    if (!text) return null;

    const parts = [];
    let lastIndex = 0;

    const keywordRegex = new RegExp(`\\b(${STRATEGIC_KEYWORDS.join('|')})\\b`, 'gi');

    let match;
    while ((match = keywordRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const keyword = match[0];
      parts.push(
        <span
          key={`topic-${match.index}`}
          className="font-semibold text-brand-accent hover:text-opacity-80 cursor-pointer transition-colors"
          onClick={() => handleTopicClick(keyword)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTopicClick(keyword);}}
        >
          {keyword}
        </span>
      );
      lastIndex = keywordRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
  };

  const memoizedClickableResponse = useMemo(() => renderClickableResponse(response), [response, handleTopicClick]);


  return (
    <Card title="AI Strategic Assistant" className="h-full flex flex-col">
      {/* Input Section */}
      <div className="space-y-4 flex-shrink-0">
        <div>
          <label htmlFor="ai-question" className="block text-sm font-semibold text-brand-text-dark mb-1">
            Pose Your Strategic Query
          </label>
          <textarea
            id="ai-question"
            rows={3}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary text-sm text-brand-text-dark"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Analyze recent EU media narratives concerning Pakistan's trade policies."
          />
        </div>
        <div className="flex space-x-2">
            <button
            onClick={handleAskQuestion}
            disabled={isLoading || !question.trim()}
            aria-busy={isLoading}
            className="flex-grow bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 flex items-center justify-center"
            >
            {isLoading ? (
                <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Processing...
                </>
            ) : (
                "Submit Query"
            )}
            </button>
            <button
                onClick={handleClear}
                disabled={isLoading && question === '' && response === ''}
                title="Clear query and response"
                className="p-2 text-slate-500 hover:text-brand-primary bg-slate-100 hover:bg-slate-200 rounded-md disabled:opacity-50"
                aria-label="Clear query and response"
            >
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
      </div>

      {/* Output Section - Takes remaining space and scrolls internally */}
      <div className="mt-6 flex-grow flex flex-col min-h-0"> {/* min-h-0 is crucial for flex-grow with overflow */}
        <h3 className="text-base font-semibold text-brand-text-dark mb-2 flex-shrink-0">Intelligence Briefing</h3>
        {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md mb-2 flex-shrink-0">{error}</p>}

        {isLoading && !response && !error && (
            <p className="text-sm text-brand-text-medium text-center py-4">Generating briefing...</p>
        )}

        {(!isLoading && !response && !error && !question) && (
             <p className="text-sm text-brand-text-medium font-normal text-center py-4 flex-shrink-0">
                Enter a query above to receive an intelligence briefing.
            </p>
        )}

        {response && (
          <div
            className="text-sm text-brand-text-dark p-3 bg-slate-50 rounded-md whitespace-pre-wrap mb-2 flex-grow max-h-[20rem] md:max-h-[24rem] overflow-y-auto" // Added max-h and overflow
            aria-live="polite"
            aria-atomic="true"
          >
            {memoizedClickableResponse}
          </div>
        )}

        {/* Cited Sources - only if sources array exists and has items */}
        {sources && sources.length > 0 && (
          <div className="mt-1 flex-shrink-0"> {/* flex-shrink-0 to prevent this from shrinking too much */}
            <h4 className="text-sm font-semibold text-brand-text-medium mb-1">Cited Sources:</h4>
            <div className="space-y-1.5 text-xs pr-1 max-h-32 overflow-y-auto"> {/* Added max-h and overflow */}
              {sources.map((source, index) => {
                if (!source.web || !source.web.uri) return null;
                const { mainTitle, sourceName } = formatSourceDisplay(source.web.title || "Untitled Source", source.web.uri);
                let formattedTitleAndSource = mainTitle;
                if (sourceName) {
                  formattedTitleAndSource += ` – ${sourceName}`;
                }

                return (
                  <div key={index} className="leading-tight">
                    <a
                      href={source.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:text-brand-secondary font-medium hover:underline inline-flex items-start group"
                      title={`Open external source: ${source.web.uri}`} // Show full URL on hover
                    >
                      <span className="mr-1">Source: {formattedTitleAndSource}</span>
                      <ExternalLinkIcon className="w-3 h-3 flex-shrink-0 text-brand-secondary group-hover:text-brand-primary transition-colors relative top-0.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Message if AI response exists but no structured sources were found/returned */}
        {sources === undefined && response && !isLoading && !error && (
            <p className="text-xs text-brand-text-medium mt-1 flex-shrink-0">No specific external web sources cited by the grounding tool for this briefing.</p>
        )}
      </div>
    </Card>
  );
};
