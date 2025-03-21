export const getMoodTrend = (averageScore: number): string => {
  let mood = "neutral";
  if (averageScore > 0.5) mood = "happy";
  else if (averageScore < -0.5) mood = "sad";
  else if (averageScore > 0) mood = "positive";
  else if (averageScore < 0) mood = "negative";
  return mood;
};
