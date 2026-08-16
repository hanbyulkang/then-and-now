"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { freshGarden, grownGarden } from "../demo-data";
import type {
  Connection,
  Conversation,
  ConversationStatus,
  GardenState,
  Memory,
  Pair,
} from "../types";
import { conversationStatus, personById } from "../types";

const STORAGE_KEY = "then-and-now:garden:v1";

type Action =
  | { type: "hydrate"; state: GardenState }
  | { type: "reset"; state: GardenState }
  | { type: "add-memory"; conversationId: string; memory: Memory }
  | {
      type: "resolve-connection";
      conversationId: string;
      connection: Connection;
    }
  | { type: "mark-seen"; conversationId: string }
  | {
      type: "mark-heard";
      memoryId: string;
      heardBefore: "never" | "remembered";
    }
  | { type: "ask-follow-up"; conversation: Conversation }
  | { type: "set-pair"; pair: Pair };

function reducer(state: GardenState, action: Action): GardenState {
  switch (action.type) {
    case "hydrate":
    case "reset":
      return action.state;

    case "set-pair":
      return { ...state, pair: action.pair, viewerId: action.pair.now.id };

    case "add-memory":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? {
                ...c,
                memories: {
                  ...c.memories,
                  [action.memory.personId]: action.memory,
                },
              }
            : c,
        ),
      };

    case "resolve-connection":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? { ...c, connection: action.connection }
            : c,
        ),
      };

    case "mark-seen":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId ? { ...c, seen: true } : c,
        ),
      };

    case "mark-heard":
      return {
        ...state,
        conversations: state.conversations.map((c) => {
          const entry = Object.entries(c.memories).find(
            ([, m]) => m.id === action.memoryId,
          );
          if (!entry) return c;
          const [personId, memory] = entry;
          return {
            ...c,
            memories: {
              ...c.memories,
              [personId]: { ...memory, heardBefore: action.heardBefore },
            },
          };
        }),
      };

    case "ask-follow-up":
      return {
        ...state,
        conversations: [...state.conversations, action.conversation],
        activeConversationId: action.conversation.id,
      };

    default:
      return state;
  }
}

interface GardenContextValue {
  state: GardenState;
  /** Today's conversation — the bud at the centre of the garden. */
  active: Conversation;
  /** Has the viewer answered the active question yet? */
  viewerHasAnswered: boolean;
  /** Has the other person answered, without revealing what they said? */
  partnerHasAnswered: boolean;
  status: ConversationStatus;
  addMemory(conversationId: string, memory: Memory): void;
  /** Looks for a shared thread. Returns undefined when nothing real is found. */
  findConnection(conversationId: string): Promise<Connection | undefined>;
  markSeen(conversationId: string): void;
  /** Records where a story already stood between them. Never a rating. */
  markHeard(memoryId: string, heardBefore: "never" | "remembered"): void;
  askFollowUp(conversationId: string): void;
  startFreshGarden(pair?: Pair): void;
  restoreDemoGarden(): void;
}

const GardenContext = createContext<GardenContextValue | null>(null);

export function GardenProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, grownGarden);

  /* Persist across reloads so a demo survives a refresh. Audio object URLs are
     session-scoped and deliberately dropped.

     Writing is gated on having read first: otherwise the save effect fires with
     the initial demo state before the restore lands, overwrites what was
     stored, and every reload quietly throws the session away. */
  const untouched = useRef(state);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: JSON.parse(raw) });
    } catch {
      /* A corrupt or unavailable store just means we start from the demo. */
    }
  }, []);

  useEffect(() => {
    if (state === untouched.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Storage full or blocked — the in-memory state still works. */
    }
  }, [state]);

  const active = useMemo(
    () =>
      state.conversations.find((c) => c.id === state.activeConversationId) ??
      state.conversations[state.conversations.length - 1],
    [state],
  );

  const addMemory = useCallback((conversationId: string, memory: Memory) => {
    dispatch({ type: "add-memory", conversationId, memory });
  }, []);

  const markSeen = useCallback((conversationId: string) => {
    dispatch({ type: "mark-seen", conversationId });
  }, []);

  const markHeard = useCallback(
    (memoryId: string, heardBefore: "never" | "remembered") => {
      dispatch({ type: "mark-heard", memoryId, heardBefore });
    },
    [],
  );

  const findConnection = useCallback(
    async (conversationId: string) => {
      const conversation = state.conversations.find(
        (c) => c.id === conversationId,
      );
      if (!conversation) return undefined;
      if (conversation.connection) return conversation.connection;

      const memories = Object.values(conversation.memories);
      /* A flower needs both sides. Nothing to compare otherwise. */
      if (memories.length < 2) return undefined;

      const { findSharedThread } = await import("../ai/connection");
      const connection = await findSharedThread({
        question: conversation.question.text,
        pair: state.pair,
        memories,
      });

      if (connection) {
        dispatch({ type: "resolve-connection", conversationId, connection });
      }
      return connection;
    },
    [state.conversations, state.pair],
  );

  const askFollowUp = useCallback(
    (conversationId: string) => {
      const parent = state.conversations.find((c) => c.id === conversationId);
      if (!parent?.connection) return;

      const id = `${conversationId}__follow_up`;
      if (state.conversations.some((c) => c.id === id)) {
        return;
      }
      dispatch({
        type: "ask-follow-up",
        conversation: {
          id,
          askedOn: new Date().toISOString().slice(0, 10),
          seen: false,
          memories: {},
          question: {
            id: `q_${id}`,
            text: parent.connection.followUp,
            category: parent.question.category,
            origin: "follow-up",
            parentConversationId: conversationId,
          },
        },
      });
    },
    [state.conversations],
  );

  const startFreshGarden = useCallback((pair?: Pair) => {
    dispatch({ type: "reset", state: freshGarden(pair) });
  }, []);

  const restoreDemoGarden = useCallback(() => {
    dispatch({ type: "reset", state: grownGarden() });
  }, []);

  const value = useMemo<GardenContextValue>(() => {
    const status = conversationStatus(active, state.pair);
    const viewer = personById(state.pair, state.viewerId);
    const partnerId =
      viewer.id === state.pair.then.id ? state.pair.now.id : state.pair.then.id;

    return {
      state,
      active,
      viewerHasAnswered: Boolean(active.memories[state.viewerId]),
      partnerHasAnswered: Boolean(active.memories[partnerId]),
      addMemory,
      findConnection,
      markSeen,
      markHeard,
      askFollowUp,
      startFreshGarden,
      restoreDemoGarden,
      status,
    };
  }, [
    state,
    active,
    addMemory,
    findConnection,
    markSeen,
    markHeard,
    askFollowUp,
    startFreshGarden,
    restoreDemoGarden,
  ]);

  return (
    <GardenContext.Provider value={value}>{children}</GardenContext.Provider>
  );
}

export function useGarden(): GardenContextValue {
  const ctx = useContext(GardenContext);
  if (!ctx) throw new Error("useGarden must be used inside <GardenProvider>");
  return ctx;
}
