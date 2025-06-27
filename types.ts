
export enum Sentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
}

export interface Article {
  id: string;
  title: string;
  date: Date; // Changed from string to Date
  source: string; // e.g., Hungary, European Union
  summary: string;
  mainTopic: string;
  sentiment?: Sentiment;
}

export interface SentimentData {
  name: string;
  value: number;
  fill: string;
}

export interface TopicData {
  name: string;
  value: number;
  fill: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  // Other types of chunks can be added here if needed
}

export enum TimePeriod {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Yearly = "Yearly",
}
