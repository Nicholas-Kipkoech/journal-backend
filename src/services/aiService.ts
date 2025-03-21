import Sentiment from "sentiment";
import compromise from "compromise"; // For extracting themes

const sentimentAnalyzer = new Sentiment();

/**
 * Analyze the sentiment of the journal entry content.
 * Returns a score between -1 (negative) to 1 (positive).
 */
export async function analyzeSentiment(text: string): Promise<number> {
  const result = sentimentAnalyzer.analyze(text);
  return Math.max(-1, Math.min(1, result.score / 10)); // Normalize score
}

/**
 * Extract themes (keywords) from journal entry content.
 * Uses NLP to find key topics.
 */
export function extractThemes(text: string): string[] {
  const doc = compromise(text);
  const themes = doc.topics().out("array"); // Extract topics using NLP
  return themes.length ? themes : ["general"]; // Default if no topics found
}
