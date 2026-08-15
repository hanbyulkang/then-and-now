import type { Conversation, GardenState, Memory, Pair } from "./types";

/**
 * One family, told consistently across every screen.
 *
 * Grandma Hyun-sook, born Seoul 1954. Ann, born Seattle 2006.
 * Fifty-two years between them.
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
    city: "Seoul",
    preferredLanguage: "ko",
    avatar: "/assets/avatars/grandma.png",
    portrait: "/assets/photos/grandma-portrait-1974.png",
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
    portrait: "/assets/photos/ann-portrait-2026.png",
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
    language: "ko",
    place: "Seoul",
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
    place: "Seattle",
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
    "그때는 학교 끝나고 친구들이랑 떡볶이 먹으러 가는 게 제일 행복했지. 돈은 별로 없었어도 같이 웃고 수다 떨던 그 시간 자체가 꽃 같았단다.",
  translation:
    "Back then, going for tteokbokki with my friends after school was what made me happiest. We had almost no money, but the time we spent laughing and talking together — that was the flower.",
  photoUrl: "/assets/photos/grandma-tteokbokki-1974.png",
  context: "Autumn Semester",
  entities: [
    { kind: "place", value: "Seoul" },
    { kind: "topic", value: "friendship" },
    { kind: "object", value: "tteokbokki" },
    { kind: "time", value: "age 20" },
    { kind: "emotion", value: "happiness" },
  ],
});

const annHappiness = nowMemory(EVERYDAY_JOY_ID, {
  id: "m_ann_happiness",
  audioUrl: "/assets/audio/ann-happiness.webm",
  durationSec: 75,
  transcript:
    "For me, just getting food with my friends after class is probably one of my favorite things. We find this small taco spot near campus and just decompress.",
  photoUrl: "/assets/photos/ann-seattle-2026.png",
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
        transcript:
          "열두 살에 부산에서 서울로 이사 왔어. 기차 안에서 엄마가 싸준 김밥을 먹었는데, 창밖으로 부산이 점점 작아지는 걸 계속 봤단다. 무섭기도 하고 설레기도 했지.",
        translation:
          "We moved from Busan to Seoul when I was twelve. On the train I ate the kimbap my mother had packed, and I kept watching Busan get smaller through the window. I was frightened and excited at the same time.",
        year: 1966,
        age: 12,
        place: "Busan → Seoul",
        durationSec: 138,
        context: "The Move",
        entities: [
          { kind: "place", value: "Busan" },
          { kind: "place", value: "Seoul" },
          { kind: "person", value: "Mother" },
          { kind: "object", value: "kimbap" },
          { kind: "object", value: "train" },
          { kind: "emotion", value: "uncertainty" },
        ],
      }),
      [ANN_ID]: nowMemory(LEAVING_HOME_ID, {
        id: "m_ann_leaving",
        transcript:
          "The first night in my dorm in Seattle I couldn't sleep at all. I kept refreshing the weather app back home like that would help. It was exciting but I felt very far away from everyone.",
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
      thenHighlight: "무섭기도 하고 설레기도 했지",
      thenGloss: "(frightened and excited at the same time)",
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
        transcript:
          "일 끝나고 힘든 날에는 꼭 엄마한테 전화했어. 별 얘기도 안 했는데, 엄마 목소리만 들어도 마음이 놓였단다.",
        translation:
          "On hard days after work I always called my mother. We barely said anything, but just hearing her voice settled me.",
        year: 1976,
        age: 22,
        durationSec: 96,
        context: "First Job",
        entities: [
          { kind: "person", value: "Mother" },
          { kind: "emotion", value: "comfort" },
          { kind: "topic", value: "belonging" },
        ],
      }),
      [ANN_ID]: nowMemory(THE_CALL_ID, {
        id: "m_ann_call",
        transcript:
          "Honestly I call Grandma. She picks up even when it's the middle of the night for her. We don't really talk about anything specific, it just helps.",
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
      thenHighlight: "엄마 목소리만 들어도 마음이 놓였단다",
      thenGloss: "(just hearing her voice settled me)",
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
        transcript:
          "선생님이 되고 싶었어. 아이들이 무슨 생각을 하는지 알고 싶었거든. 결국 다른 길로 갔지만 그 마음은 안 변했어.",
        translation:
          "I wanted to be a teacher. I wanted to understand what children were thinking. I ended up on a different path, but that feeling never changed.",
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
      thenHighlight: "아이들이 무슨 생각을 하는지 알고 싶었거든",
      thenGloss: "(I wanted to understand what children were thinking)",
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
        transcript:
          "엄마한테 처음 배운 건 미역국이었어. 생일에 끓이는 거라고, 물 양이 제일 중요하다고 하셨지.",
        translation:
          "The first thing my mother taught me was seaweed soup. She said it was for birthdays, and that the amount of water mattered most.",
        year: 1968,
        age: 14,
        durationSec: 74,
        context: "The Kitchen",
        entities: [
          { kind: "person", value: "Mother" },
          { kind: "object", value: "miyeokguk" },
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
  thenHighlight: "떡볶이 먹으러 가는 게",
  thenGloss: "(getting tteokbokki with my friends after school)",
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
          [grandmaId]: { ...structuredClone(grandmaHappiness), personId: grandmaId },
        },
      },
    ],
  };
}
