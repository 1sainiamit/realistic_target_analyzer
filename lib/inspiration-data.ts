export interface InspirationProfile {
  name: string;
  height: number; // cm
  stageWeight: number; // kg
  bodyFat: number; // %
  trainingYears: number;
  level: "elite" | "advanced" | "athletic";
}

export const inspirations: Record<string, InspirationProfile> = {
  "chris bumstead": {
    name: "Chris Bumstead",
    height: 185,
    stageWeight: 110,
    bodyFat: 6,
    trainingYears: 10,
    level: "elite"
  },
  "athletic model": {
    name: "Athletic Model",
    height: 180,
    stageWeight: 80,
    bodyFat: 10,
    trainingYears: 5,
    level: "advanced"
  },
  "chris hemsworth": {
    name: "Chris Hemsworth (Thor)",
    height: 190,
    stageWeight: 95,
    bodyFat: 10,
    trainingYears: 15,
    level: "advanced"
  },
  "thor": {
    name: "Chris Hemsworth (Thor)",
    height: 190,
    stageWeight: 95,
    bodyFat: 10,
    trainingYears: 15,
    level: "advanced"
  },
  "hemsworth": {
    name: "Chris Hemsworth (Thor)",
    height: 190,
    stageWeight: 95,
    bodyFat: 10,
    trainingYears: 15,
    level: "advanced"
  },
  "david laid": {
    name: "David Laid",
    height: 188,
    stageWeight: 88,
    bodyFat: 8,
    trainingYears: 10,
    level: "advanced"
  },
  "alex eubank": {
    name: "Alex Eubank",
    height: 175,
    stageWeight: 78,
    bodyFat: 9,
    trainingYears: 8,
    level: "advanced"
  },
  "cbum": {
    name: "Chris Bumstead",
    height: 185,
    stageWeight: 110,
    bodyFat: 6,
    trainingYears: 10,
    level: "elite"
  }
};