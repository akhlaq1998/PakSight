
import { Article, SentimentData, TopicData, TimePeriod } from './types';

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
export const API_REQUEST_TIMEOUT_MS = 5000;

// Base Mock Data (will be used and varied by helper functions)
const BASE_MOCK_STRATEGIC_OVERVIEW = "Pakidan was mentioned in %MENTIONS% articles across Hungary and EU media %PERIOD_TEXT%. Coverage predominantly focused on economic relations and diplomatic initiatives. Sentiment was mostly neutral, with some negative commentary on security.";
const BASE_MOCK_MENTION_FREQUENCY = 24;
const BASE_MOCK_SENTIMENT_BREAKDOWN: SentimentData[] = [
  { name: 'Hungary', value: 70, fill: '#4CAF50' },
  { name: 'Diplomacy', value: 60, fill: '#81C784' },
  { name: 'Security', value: 40, fill: '#FFEB3B' },
  { name: 'Migration', value: 25, fill: '#FF9800' },
];
const BASE_MOCK_TOP_TOPICS: TopicData[] = [
  { name: 'Economy', value: 45, fill: '#2196F3' },
  { name: 'Diplomacy', value: 30, fill: '#4CAF50' },
  { name: 'Security', value: 15, fill: '#FFC107' },
  { name: 'Migration', value: 10, fill: '#FF7043' },
];

export const MOCK_MENTION_SOURCES = [
  "Prime Minse of Raikistan",
  "European Commission",
  "IMFI",
  "NATO"
];

// Updated MOCK_ARTICLES with real Date objects
export const ALL_MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: "Pakistan and EU Discuss Trade Expansion Plans (This Week)",
    date: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
    source: "European Union",
    summary: "Coverage is highlighted by optimistic remarks on trade cooperation.",
    mainTopic: "Trade",
  },
  {
    id: '2',
    title: "EU Expresses Concerns Over Pakistan's Anti-Terror Measures (Last Week)",
    date: new Date(new Date().setDate(new Date().getDate() - 7)), // 1 week ago
    source: "European Union",
    summary: "Cautiously critical of security measures, citing human rights concerns.",
    mainTopic: "Security",
  },
  {
    id: '3',
    title: "Pakistan-EU Dialogue: Commitment to Strengthen Bilateral Ties (Last Month)",
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)), // 1 month ago
    source: "European Union",
    summary: "Notes a constructive tone towards diplomatic relations and future partnerships.",
    mainTopic: "Diplomacy",
  },
  {
    id: '4',
    title: "Hungary Seeks Closer Economic Ties with Pakistan (Last Month)",
    date: new Date(new Date().setMonth(new Date().getMonth() - 1, new Date().getDate() - 5)), // ~1 month ago
    source: "Hungary",
    summary: "Reports on a high-level delegation visit focusing on investment opportunities.",
    mainTopic: "Economy",
  },
  {
    id: '5',
    title: "Hungarian Media Highlights Cultural Exchange with Pakistan (This Year)",
    date: new Date(new Date().setMonth(new Date().getMonth() - 3)), // 3 months ago (within this year)
    source: "Hungary",
    summary: "Positive coverage of a cultural festival promoting Pakistani heritage in Budapest.",
    mainTopic: "Culture",
  },
  {
    id: '6',
    title: "Yearly Review: Pakistan's Diplomatic Engagements with EU (Last Year)",
    date: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // 1 year ago
    source: "European Union",
    summary: "A retrospective look at diplomatic activities over the past year.",
    mainTopic: "Diplomacy",
  },
   {
    id: '7',
    title: "Daily Brief: Pakistan Economic Update",
    date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
    source: "European Union",
    summary: "A daily update on economic indicators and news related to Pakistan from EU sources.",
    mainTopic: "Economy",
  },
  {
    id: '8',
    title: "Hungary's Stance on Pakistan's Trade Policy (This Week)",
    date: new Date(new Date().setDate(new Date().getDate() - 3)), // 3 days ago
    source: "Hungary",
    summary: "Analysis of Hungary's official position on recent trade policy announcements from Pakistan.",
    mainTopic: "Trade",
  }
];


export const MOCK_INITIAL_AI_QUESTION = "What is the sentiment on Pakistan in European media this week?";
export const MOCK_INITIAL_AI_RESPONSE = "Sentiment remains predominantly neutral in European media. Positive notes are present regarding economic relations, albeit tempered by concerns on security issues.";


// Helper function to simulate data variation
const varyData = (value: number, period: TimePeriod): number => {
  let multiplier = 1;
  switch (period) {
    case TimePeriod.Daily: multiplier = 0.5 + Math.random() * 0.2; break; // smaller for daily
    case TimePeriod.Weekly: multiplier = 0.8 + Math.random() * 0.4; break;
    case TimePeriod.Monthly: multiplier = 1.0 + Math.random() * 0.3; break;
    case TimePeriod.Yearly: multiplier = 1.2 + Math.random() * 0.5; break; // larger for yearly
  }
  return Math.max(5, Math.floor(value * multiplier + (Math.random() - 0.5) * 10)); // Ensure value is at least 5
};

export const getMockDashboardData = (period: TimePeriod) => {
  const mentionFrequency = varyData(BASE_MOCK_MENTION_FREQUENCY, period);
  
  let periodText = "in the last 10 days"; // Default
  if (period === TimePeriod.Daily) periodText = "today";
  else if (period === TimePeriod.Weekly) periodText = "this week";
  else if (period === TimePeriod.Monthly) periodText = "this month";
  else if (period === TimePeriod.Yearly) periodText = "this year";

  const strategicOverview = BASE_MOCK_STRATEGIC_OVERVIEW
    .replace('%MENTIONS%', mentionFrequency.toString())
    .replace('%PERIOD_TEXT%', periodText);

  const sentimentBreakdown = BASE_MOCK_SENTIMENT_BREAKDOWN.map(item => ({
    ...item,
    value: varyData(item.value, period)
  }));

  const topTopics = BASE_MOCK_TOP_TOPICS.map(item => ({
    ...item,
    value: varyData(item.value, period)
  }));
  
  // Article filtering logic will be in ArticleHighlightsSection, using ALL_MOCK_ARTICLES
  // Here we just pass all articles, the component will filter.
  // Or, DashboardPage can pre-filter and pass down, which is cleaner.

  return {
    strategicOverview,
    mentionFrequency,
    sentimentBreakdown,
    topTopics,
    articles: ALL_MOCK_ARTICLES // Pass all, filtering will happen in component or DashboardPage
  };
};
