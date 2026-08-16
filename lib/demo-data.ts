import type { Conversation, GardenState, Memory, Pair } from "./types";

/**
 * One family, told consistently across every screen.
 *
 * Grandma, born Savannah 1954 — Atlanta at twelve, Athens at twenty, Chicago at
 * twenty-two. Ann, born Seattle 2006. Fifty-two years between them.
 *
 * Every story here is something a real person could have said out loud, because
 * the product only works if the words are worth the pause before the flower.
 */

export const GRANDMA_ID = "p_grandma";
export const ANN_ID = "p_ann";

export const DEMO_PAIR: Pair = {
  id: "pair_demo",
  gardenName: "Ann & Grandma's Garden",
  createdAt: "2026-06-02T09:00:00.000Z",
  then: {
    id: GRANDMA_ID,
    name: "Grandma",
    side: "then",
    relationship: "Grandmother",
    birthYear: 1954,
    city: "Savannah",
    preferredLanguage: "en",
    avatar: "/assets/avatars/grandma.png",
    portrait: "/assets/photos/grandma-portrait-1976.jpg",
  },
  now: {
    id: ANN_ID,
    name: "Ann",
    side: "now",
    relationship: "You",
    birthYear: 2006,
    city: "Seattle",
    preferredLanguage: "en",
    avatar: "/assets/avatars/ann.png",
    portrait: "/assets/photos/ann-portrait-2026.jpg",
  },
};

function thenMemory(
  conversationId: string,
  fields: Partial<Memory> & Pick<Memory, "id" | "transcript" | "context">,
): Memory {
  return {
    conversationId,
    personId: GRANDMA_ID,
    durationSec: 160,
    language: "en",
    place: "Athens, GA",
    year: 1974,
    age: 20,
    entities: [],
    createdAt: "2026-06-02T09:12:00.000Z",
    ...fields,
  } as Memory;
}

function nowMemory(
  conversationId: string,
  fields: Partial<Memory> & Pick<Memory, "id" | "transcript" | "context">,
): Memory {
  return {
    conversationId,
    personId: ANN_ID,
    durationSec: 75,
    language: "en",
    place: "Seattle, WA",
    year: 2026,
    age: 20,
    entities: [],
    createdAt: "2026-06-02T18:40:00.000Z",
    ...fields,
  } as Memory;
}

/* -------------------------------------------------------------------------- */
/* The signature conversation — the one the demo plays through live.           */
/* -------------------------------------------------------------------------- */

export const EVERYDAY_JOY_ID = "c_everyday_joy";

const grandmaHappiness = thenMemory(EVERYDAY_JOY_ID, {
  id: "m_grandma_happiness",
  audioUrl: "/assets/audio/grandma-happiness.webm",
  durationSec: 160,
  transcript:
    "Walking down to the drugstore counter with my girlfriends after class was the best part of the whole week. We had almost no money between us — one cherry Coke each and we'd sit on those stools until they turned the lights off on us. I can still hear us laughing.",
  photoUrl: "/assets/photos/grandma-counter-1974.jpg",
  context: "Autumn Semester",
  entities: [
    { kind: "place", value: "Athens" },
    { kind: "topic", value: "friendship" },
    { kind: "object", value: "cherry Coke" },
    { kind: "time", value: "age 20" },
    { kind: "emotion", value: "happiness" },
  ],
});

const annHappiness = nowMemory(EVERYDAY_JOY_ID, {
  id: "m_ann_happiness",
  audioUrl: "/assets/audio/ann-happiness.webm",
  durationSec: 75,
  transcript:
    "Honestly, getting food with my friends after class is probably my favorite thing. There's this tiny taco place near campus and we just sit there and decompress for way too long.",
  photoUrl: "/assets/photos/ann-seattle-2026.jpg",
  context: "Sophomore Year",
  entities: [
    { kind: "place", value: "Seattle" },
    { kind: "topic", value: "friendship" },
    { kind: "object", value: "tacos" },
    { kind: "time", value: "age 20" },
    { kind: "emotion", value: "happiness" },
  ],
});

/* -------------------------------------------------------------------------- */
/* Earlier conversations — already discovered, already flowering.              */
/* -------------------------------------------------------------------------- */

const LEAVING_HOME_ID = "c_leaving_home";
const THE_CALL_ID = "c_the_call";
const BECOMING_ID = "c_becoming";
const RECIPE_ID = "c_recipe";

const conversations: Conversation[] = [
  {
    id: LEAVING_HOME_ID,
    askedOn: "2026-06-03",
    seen: true,
    question: {
      id: "q_leaving_home",
      text: "What do you remember about the first time you left home?",
      category: "Home",
      origin: "daily",
    },
    memories: {
      [GRANDMA_ID]: thenMemory(LEAVING_HOME_ID, {
        id: "m_grandma_leaving",
        photoUrl: "/assets/photos/grandma-portrait-1976.jpg",
        transcript:
          "We moved up to Atlanta the summer I turned twelve. I ate the sandwich my mother packed on the bus and watched the marsh get smaller and smaller out the window the whole way. I was scared and thrilled at the same time and I didn't tell anybody either one.",
        year: 1966,
        age: 12,
        place: "Savannah → Atlanta",
        durationSec: 138,
        context: "The Move",
        entities: [
          { kind: "place", value: "Savannah" },
          { kind: "place", value: "Atlanta" },
          { kind: "person", value: "Mother" },
          { kind: "object", value: "bus" },
          { kind: "emotion", value: "uncertainty" },
        ],
      }),
      [ANN_ID]: nowMemory(LEAVING_HOME_ID, {
        id: "m_ann_leaving",
        photoUrl: "/assets/photos/ann-portrait-2026.jpg",
        transcript:
          "The first night in my dorm I couldn't sleep at all. I kept refreshing the weather back home like that would help somehow. It was exciting but I felt very far away from everyone.",
        year: 2024,
        age: 18,
        durationSec: 68,
        context: "Freshman Move-in",
        entities: [
          { kind: "place", value: "Seattle" },
          { kind: "emotion", value: "uncertainty" },
          { kind: "topic", value: "leaving home" },
        ],
      }),
    },
    connection: {
      theme: "Leaving Home",
      headline: "Different cities.",
      statement: "Similar uncertainty.",
      thenHighlight: "I was scared and thrilled at the same time",
      nowHighlight: "It was exciting but I felt very far away from everyone",
      followUp: "What did you miss most in the first week?",
    },
  },
  {
    id: THE_CALL_ID,
    askedOn: "2026-06-08",
    seen: true,
    question: {
      id: "q_the_call",
      text: "Who did you call when a day went badly?",
      category: "Family",
      origin: "follow-up",
      parentConversationId: LEAVING_HOME_ID,
    },
    memories: {
      [GRANDMA_ID]: thenMemory(THE_CALL_ID, {
        id: "m_grandma_call",
        heardBefore: "never",
        photoUrl: "/assets/photos/grandma-window-1976.jpg",
        transcript:
          "After a bad shift I'd use the pay phone in the hallway and call my mother, even though it cost me. We hardly said anything worth saying. Just hearing her voice settled me right down.",
        year: 1976,
        age: 22,
        place: "Chicago, IL",
        durationSec: 96,
        context: "First Job",
        entities: [
          { kind: "person", value: "Mother" },
          { kind: "place", value: "Chicago" },
          { kind: "emotion", value: "comfort" },
          { kind: "topic", value: "belonging" },
        ],
      }),
      [ANN_ID]: nowMemory(THE_CALL_ID, {
        id: "m_ann_call",
        transcript:
          "Honestly I call Grandma. She picks up even when it's late for her. We don't really talk about anything specific, it just helps.",
        year: 2026,
        age: 20,
        durationSec: 52,
        context: "Sophomore Year",
        entities: [
          { kind: "person", value: "Grandma" },
          { kind: "emotion", value: "comfort" },
          { kind: "topic", value: "belonging" },
        ],
      }),
    },
    connection: {
      theme: "The One You Call",
      headline: "Two generations apart.",
      statement: "The same phone call.",
      thenHighlight: "Just hearing her voice settled me right down",
      nowHighlight: "We don't really talk about anything specific, it just helps",
      followUp: "What did your mother's voice sound like on the phone?",
    },
  },
  {
    id: BECOMING_ID,
    askedOn: "2026-06-14",
    seen: true,
    question: {
      id: "q_becoming",
      text: "What did you think your life would look like at my age?",
      category: "Dreams",
      origin: "daily",
    },
    memories: {
      [GRANDMA_ID]: thenMemory(BECOMING_ID, {
        id: "m_grandma_becoming",
        heardBefore: "never",
        photoUrl: "/assets/photos/grandma-college-1974.jpg",
        transcript:
          "I was going to be a teacher. What I really wanted was to know what children were thinking — they always seemed to be working something out. Life took me another way, but that part of me never changed.",
        year: 1974,
        age: 20,
        durationSec: 112,
        context: "Autumn Semester",
        entities: [
          { kind: "topic", value: "dreams" },
          { kind: "topic", value: "teaching" },
          { kind: "emotion", value: "curiosity" },
        ],
      }),
      [ANN_ID]: nowMemory(BECOMING_ID, {
        id: "m_ann_becoming",
        photoUrl: "/assets/photos/ann-living-2026.jpg",
        transcript:
          "I think I want to do research. Not the lab kind — more like figuring out why people do what they do. I don't really know what that job is called yet.",
        year: 2026,
        age: 20,
        durationSec: 61,
        context: "Sophomore Year",
        entities: [
          { kind: "topic", value: "dreams" },
          { kind: "topic", value: "research" },
          { kind: "emotion", value: "curiosity" },
        ],
      }),
    },
    connection: {
      theme: "Understanding People",
      headline: "Different words for it.",
      statement: "Both wanted to understand people.",
      thenHighlight: "to know what children were thinking",
      nowHighlight: "figuring out why people do what they do",
      followUp: "Who was the first person you tried to understand?",
    },
  },
  {
    /* A memory that stands on its own — no shared thread found yet.
       Deliberately present: leaves outnumber flowers in a real garden. */
    id: RECIPE_ID,
    askedOn: "2026-06-19",
    seen: true,
    question: {
      id: "q_recipe",
      text: "What is the first thing you learned to cook?",
      category: "Food",
      origin: "follow-up",
      parentConversationId: THE_CALL_ID,
    },
    memories: {
      [GRANDMA_ID]: thenMemory(RECIPE_ID, {
        id: "m_grandma_recipe",
        heardBefore: "remembered",
        transcript:
          "My mother taught me her buttermilk biscuits before anything else. Don't work the dough, she said, and get that oven hotter than you think it ought to be.",
        year: 1968,
        age: 14,
        place: "Atlanta, GA",
        durationSec: 74,
        context: "The Kitchen",
        entities: [
          { kind: "person", value: "Mother" },
          { kind: "object", value: "biscuits" },
          { kind: "topic", value: "food" },
        ],
      }),
    },
    /* No connection — Ann has not answered this one. */
  },
  {
    /* Today. Grandma has answered; the viewer has not. */
    id: EVERYDAY_JOY_ID,
    askedOn: "2026-06-24",
    seen: false,
    question: {
      id: "q_everyday_joy",
      text: "What made you happy when you were twenty?",
      category: "Happiness",
      origin: "daily",
    },
    memories: {
      [GRANDMA_ID]: grandmaHappiness,
    },
  },
];

/** The connection waiting to be found once both stories exist. */
export const EVERYDAY_JOY_CONNECTION = {
  theme: "Everyday Joy",
  headline: "52 years apart.",
  statement: "Same kind of happiness.",
  thenHighlight: "Walking down to the drugstore counter with my girlfriends",
  nowHighlight: "getting food with my friends",
  followUp: "What did friendship mean to you at twenty?",
};

/** Ann's answer, used when the demo is played without a microphone. */
export const ANN_FALLBACK_ANSWER = annHappiness;

/**
 * The demo garden: three discovered flowers, one lone leaf, and today's
 * question waiting at the centre.
 */
export function grownGarden(): GardenState {
  return {
    pair: DEMO_PAIR,
    conversations: structuredClone(conversations),
    activeConversationId: EVERYDAY_JOY_ID,
    viewerId: ANN_ID,
  };
}

/**
 * A garden that has just been planted: two seedlings, one unopened bud.
 * This is what you see the moment onboarding finishes.
 */
export function freshGarden(pair: Pair = DEMO_PAIR): GardenState {
  const grandmaId = pair.then.id;
  return {
    pair,
    activeConversationId: EVERYDAY_JOY_ID,
    viewerId: pair.now.id,
    conversations: [
      {
        id: EVERYDAY_JOY_ID,
        askedOn: "2026-06-24",
        seen: false,
        question: {
          id: "q_everyday_joy",
          text: "What made you happy when you were twenty?",
          category: "Happiness",
          origin: "daily",
        },
        memories: {
          [grandmaId]: {
            ...structuredClone(grandmaHappiness),
            personId: grandmaId,
          },
        },
      },
    ],
  };
}
