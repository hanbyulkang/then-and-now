/**
 * Then & Now — domain model.
 *
 * The vocabulary here follows the garden, not a database: a question becomes a
 * bud, one person's answer becomes a leaf, and a flower only exists where a
 * genuine shared thread was found between the two people.
 */

export type Side = "then" | "now";

export type LanguageCode = "ko" | "en";

export interface Person {
  id: string;
  name: string;
  /** Which visual language this person lives in. */
  side: Side;
  /** "Grandmother", "You" — shown as relationship, never as a role label. */
  relationship: string;
  birthYear: number;
  city: string;
  preferredLanguage: LanguageCode;
  avatar: string;
  /** Portrait used on reveal panels and profile pages. */
  portrait: string;
}

export type EntityKind =
  | "person"
  | "place"
  | "time"
  | "topic"
  | "object"
  | "emotion";

export interface MemoryEntity {
  kind: EntityKind;
  value: string;
}

/** One person's answer to one question. A leaf in the garden. */
export interface Memory {
  id: string;
  conversationId: string;
  personId: string;
  /** Original recording. Optional — a story may have been written instead. */
  audioUrl?: string;
  /** Recorded audio held only for this session (object URL), if any. */
  localAudioUrl?: string;
  durationSec: number;
  /** The original words. Never rewritten. */
  transcript: string;
  language: LanguageCode;
  /** Optional, opt-in translation. Always secondary to the original. */
  translation?: string;
  photoUrl?: string;
  place: string;
  year: number;
  age: number;
  /** "Autumn Semester", "Sophomore Year" — small human context. */
  context: string;
  entities: MemoryEntity[];
  /**
   * What the other one said when they first heard it. Not a rating and not a
   * like — the two answers only record where this memory already stood between
   * them. "never" means they met a piece of her life for the first time.
   */
  heardBefore?: "never" | "remembered";
  createdAt: string;
}

export type QuestionOrigin = "daily" | "follow-up";

export interface Question {
  id: string;
  text: string;
  category: string;
  origin: QuestionOrigin;
  /** Set when this question grew out of an earlier shared flower. */
  parentConversationId?: string;
}

/**
 * A discovered shared thread. Its existence is the whole point — a flower must
 * never appear just because two people answered (spec §11).
 */
export interface Connection {
  /** "Everyday Joy" — the flower's name. */
  theme: string;
  /** "52 years apart." */
  headline: string;
  /** "Same kind of happiness." */
  statement: string;
  /** Exact substring of the THEN transcript to highlight. */
  thenHighlight: string;
  /** Exact substring of the NOW transcript to highlight. */
  nowHighlight: string;
  /** Plain-language gloss shown under a non-English highlight. */
  thenGloss?: string;
  /** The next question this discovery opened up. */
  followUp: string;
}

export type ConversationStatus =
  /** Nobody has answered. */
  | "seed"
  /** One person has answered; the other's answer is still hidden. */
  | "waiting"
  /** Both answered, not yet opened together. */
  | "ready"
  /** Opened together; the connection (if any) has been seen. */
  | "revealed";

export interface Conversation {
  id: string;
  question: Question;
  askedOn: string;
  /** Keyed by person id. Blind until both are present. */
  memories: Record<string, Memory>;
  /** Present only once a real shared thread was found. */
  connection?: Connection;
  /** True once the reveal + bloom has been played through. */
  seen: boolean;
}

export interface Pair {
  id: string;
  then: Person;
  now: Person;
  gardenName: string;
  createdAt: string;
}

export interface GardenState {
  pair: Pair;
  conversations: Conversation[];
  /** The conversation currently sitting at the centre of the garden. */
  activeConversationId: string;
  /** Who is using the app right now. Drives blind answering. */
  viewerId: string;
}

/* -------------------------------------------------------------------------- */

export function conversationStatus(
  conversation: Conversation,
  pair: Pair,
): ConversationStatus {
  const hasThen = Boolean(conversation.memories[pair.then.id]);
  const hasNow = Boolean(conversation.memories[pair.now.id]);
  if (!hasThen && !hasNow) return "seed";
  if (!hasThen || !hasNow) return "waiting";
  return conversation.seen ? "revealed" : "ready";
}

/** Flowers exist only where a connection was found. */
export function flowersOf(state: GardenState): Conversation[] {
  return state.conversations.filter((c) => c.seen && c.connection);
}

/** Individual memories that have not (yet) joined a shared flower. */
export function loneLeaves(state: GardenState): Memory[] {
  return state.conversations
    .filter((c) => !c.connection)
    .flatMap((c) => Object.values(c.memories));
}

export function yearsBetween(pair: Pair): number {
  return Math.abs(pair.now.birthYear - pair.then.birthYear);
}

export function personById(pair: Pair, id: string): Person {
  return pair.then.id === id ? pair.then : pair.now;
}

/** The stories one person heard for the first time. */
export function discoveredBy(
  state: GardenState,
  viewerId: string,
  kind: "never" | "remembered",
): Memory[] {
  return state.conversations
    .flatMap((c) => Object.values(c.memories))
    .filter((m) => m.personId !== viewerId && m.heardBefore === kind)
    .sort((a, b) => a.year - b.year);
}

export function otherPerson(pair: Pair, id: string): Person {
  return pair.then.id === id ? pair.now : pair.then;
}
