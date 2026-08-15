# Then & Now — implementation status

Figma file: `ltQVkeS9mwQtkVEFcEoncG`
Specs: `docs/then-and-now-web-design-spec.md`, `docs/then-and-now-product-plan.md`

Legend: ✅ done · ◐ partial · ✗ not started

## Figma nodes

| Node | Screen | Inspected | Mapped to | Implemented | Responsive | Reviewed in browser | Interaction |
|---|---|---|---|---|---|---|---|
| `2:250` | 01 Landing | ✅ | `/` | ✅ | ✅ | ✅ | ✅ seed roots on CTA hover |
| `2:835` | 02 Onboarding: Who | ✅ | `/onboarding/who` | ✅ | ✅ | ✅ | ✅ radio tiles |
| `2:880` | 03 Onboarding: Names | ✅ | `/onboarding/names` | ✅ | ✅ | ✅ | ✅ journal fields |
| `2:278` | 04 Onboarding: Garden Created | ✅ | `/onboarding/ready` | ✅ | ✅ | ✅ | ✅ seedlings grow in, copy invite link |
| `2:7` | 05 Initial Garden | ✅ | `/garden` (no flowers yet) | ✅ | ✅ | ✅ | ✅ labelled seedlings, question card |
| `2:53` | 06 Answer Overlay | ✅ | overlay on `/garden` | ✅ | ✅ | ✅ | ✅ real recording, write instead, photo |
| `2:313` | 07 Both Stories Ready | ✅ | `/garden` (status `ready`) | ✅ | ✅ | ✅ | ✅ bud warms, Reveal together |
| `2:103` | 08 Reveal: Before Connection | ✅ | `/reveal/[id]` phase `stories` | ✅ | ✅ | ✅ | ✅ audio playback, translation toggle |
| `2:174` | 09 Reveal: Signature Bloom | ✅ | `/reveal/[id]` phases `branches`→`followUp` | ✅ | ✅ | ✅ | ✅ full bloom sequence |
| `2:356` | 10 Grown Garden | ✅ | `/garden` (with flowers) | ✅ | ✅ | ✅ | ✅ hover preview, open flower |
| `2:547` | 11 Stories Archive | ✅ | `/stories` | ✅ | ✅ | ✅ | ✅ filters, per-entry playback |
| `2:653` | 12 Between Us | ✅ | `/between-us` | ✅ | ✅ | ✅ | ✅ theme hover lifts both portraits |
| `2:442` | 13 Shared Memory Detail | ✅ | `/memory/[id]` | ✅ | ✅ | ✅ | ✅ continue the conversation |
| `2:781` | 14 Meet Her at My Age | ✅ | `/meet-her` | ✅ | ✅ | ✅ | ✅ climbing vine, CTA |
| `2:932` | M1 Mobile Landing | ✅ | `/` at `<md` | ✅ | ✅ | ✅ | — |
| `2:960` | M2 Mobile Garden | ✅ | `/garden` at `<md` | ✅ | ✅ | ✅ | — |
| `2:1020` | M3 Mobile Answer | ✅ | overlay at `<md` | ✅ | ✅ | ✅ | ✅ mic on finish button |
| `2:1104` | M4 Mobile Reveal | ✅ | `/reveal/[id]` at `<md` | ✅ | ✅ | ✅ | ✅ THEN ↓ shared ↓ NOW |
| `2:1194` | M5 Mobile Grown Garden | ✅ | `/garden` at `<md` | ✅ | ✅ | ✅ | — |
| `2:1279` | M6 Mobile Stories | ✅ | `/stories` at `<md` | ✅ | ✅ | ✅ | ✅ filter pills |

## Routes

| Route | Screen |
|---|---|
| `/` | Landing |
| `/onboarding/who` · `/names` · `/ready` | Pairing |
| `/garden` | Garden — home of the product, both the empty and grown states |
| `/reveal/[id]` | Reveal + signature bloom |
| `/memory/[id]` | Shared memory detail |
| `/stories` | Editorial archive |
| `/between-us` | Shared themes |
| `/meet-her` | Meet Her at My Age |
| `/api/connection` | Looks for a shared thread between two stories |

## Shared components

- `nav/Navigation`, `nav/ProfilePair` — one bar, three places; bottom tabs on mobile ✅
- `garden/GardenCanvas`, `SharedFlower`, `RootSystem`, `QuestionBud`, `StoryPreview` ✅
- `garden/Tree` — one tree, two hands ✅
- `garden/Leaf` — the specimen table and its attachment maths ✅
- `garden/GroundPlanting` — the bed both people stand in ✅
- `botanical/Seedling` (organic + geometric), `Seed`, `Bud`, `Vine` ✅
- `answer/AnswerOverlay`, `lib/voice/use-recorder` ✅
- `audio/AudioPlayer`, `audio/Waveform` ✅
- `reveal/StoryPanel`, `BloomSequence`, `HighlightedTranscript`, `FollowUpBar`, `phases` ✅
- `ui/Icon`, `ui/MaskIcon` ✅

## Systems

| Item | Status |
|---|---|
| Design tokens (THEN / NOW / BETWEEN) | ✅ `app/globals.css` |
| Typography (Instrument Serif · Fraunces · Geist) | ✅ |
| Garden composition | ✅ `lib/garden-tree.ts` — one tree, fixed limbs and blossom slots |
| Bloom sequence, 4–6s | ✅ `components/reveal/phases.ts` |
| `prefers-reduced-motion` | ✅ animations collapse to fades |
| Blind answering | ✅ partner's story never rendered before both exist |
| Flowers require a real connection | ✅ `flowersOf()` filters on `connection` |
| Voice recording | ✅ MediaRecorder + Web Speech API, written fallback |
| Transcription | ◐ browser speech recognition; demo transcript when unavailable |
| Connection discovery | ✅ Claude via `/api/connection`; curated fallback without a key |
| Photographs, icons, vine | ✅ exported from Figma into `public/assets` |
| Botanical artwork | ✅ drawn with Recraft — petals, leaves, bud |
| Paper grain | ✅ procedural `feTurbulence`, seamless at any size |
| Typecheck · lint · build | ✅ |

## Deployment

| | |
|---|---|
| Live | https://then-and-now-olive.vercel.app |
| Repo | https://github.com/hanbyulkang/then-and-now (private) |
| Production env | `ANTHROPIC_API_KEY`, `AI_MODEL` set on Vercel |
| Verified in production | garden renders, `/api/connection` returns a real thread |

## Botanical art direction

The shapes exported from the design file were primitives — ellipses, rounded
rectangles and straight lines — which read as crude at real sizes. Everything
botanical is now drawn artwork, in one of two hands:

- **THEN** — an old botanical plate. Heavy uneven inked contour, solid fill,
  visible veining.
- **NOW** — a lighter, simpler hand. One calm thin contour sitting exactly on the
  edge of a pale fill, with far fewer marks.

Both are finished drawings by hand. The contrast is the hand, not the geometry.
Two earlier passes were wrong in opposite directions: NOW as ruled facets and
angular diagrams read as technical rather than as a garden, and NOW as an offset
outline floating away from its fill read as an unfinished sketch.

| Asset | Used by |
|---|---|
| `then/petal` · `now/petal` | the two halves of every shared flower |
| `then/leaf` · `now/leaf` | branches, roots, seedlings, lone memories |
| `then/grass` · `fern` · `sprig` · `pods` | THEN's bed, and the ground both stand in |
| `now/grass` · `sprig` · `pods` | NOW's bed |
| `shared/bud` | today's question, every follow-up bar |
| `vine/*` | the climbing vine on Meet Her at My Age |

Placement is the other half of the work. Each specimen declares where it
attaches and which way it points, so a leaf joins a limb at its stalk and a
plant stands on its base. Leaves are placed on the curve itself and turned to
face along it. Stems are filled tapered shapes rather than constant-width
strokes — a stroke of even weight is what makes a branch read as wire.

The garden is one tree. A trunk that belongs to both of them rises from the bed
and divides at the crown; above that line the left canopy is drawn in THEN's
hand and the right in NOW's, and they interleave rather than splitting the tree
down the middle. Every discovered connection hangs on it as a flower, clustered
where the two canopies overlap. Earlier passes scattered a plant per flower
across the full width, which read as busy and unplaced rather than as somewhere
you are standing.

What stayed programmatic, and why: every branch, trunk and stem is an SVG path
drawn by `stroke-dashoffset`, so it can grow on screen — the signature bloom
depends on it. The flower's fan, its per-flower variation and its bloom are code
for the same reason. Recraft draws the specimen; the garden plants it.

## Known limitations

- Seeded memories have no audio files, so their player runs on a clock. Anything
  recorded in-session plays for real.
- Speech recognition is Chrome/Safari only. Elsewhere the recording is kept and
  the written fallback covers the transcript.
- Pair state is per-browser (`localStorage`). Two devices do not sync yet; the
  data layer is shaped so a Supabase adapter can replace it without touching UI.
