# Then & Now

**A shared memory garden for two generations.**
One question at a time, discover the stories you never knew to ask.

Two people from different generations answer the same question without seeing
each other's answer. When both have spoken, they open them together — and where
their two stories turn out to share something real, a flower grows between them.

Live: https://then-and-now-olive.vercel.app

## The idea

Families don't lack stories. They lack the questions that uncover them.

So the product's job is not to store memories, it is to find the next question
worth asking. That principle decides most of the design:

- **The original voice is the story.** Nothing is rewritten, summarised, or
  improved. A transcript is shown in the language it was spoken in; translation
  is optional and always secondary.
- **Answers are blind.** What the other person said is never on screen until
  both have answered. The reveal is the whole point of the wait.
- **A flower has to be earned.** Two people answering the same question does not
  produce one. There has to be a real shared thread — a feeling, a need, a
  relationship — and when there isn't, the garden says so and leaves two
  separate leaves standing side by side.
- **AI is infrastructure, not the product.** No confidence scores, no "semantic
  match", no generated prose competing with what a grandmother actually said.

## Running it

```bash
npm install
npm run dev
```

It works with no configuration: the app ships with one family's story and falls
back to it when no model is reachable.

To enable real connection discovery, copy `.env.example` to `.env.local` and add
an Anthropic API key.

## How it is built

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Claude via the AI SDK.

```
app/
  page.tsx                 Landing — two generations, nothing between them yet
  onboarding/              Who · Names · Garden created
  garden/                  Home. The garden is the product; there is no dashboard
  reveal/[id]/             Both stories, then the signature bloom
  memory/[id]/             A shared memory in full
  stories/                 Editorial archive of every memory, both generations
  between-us/              Only what the two of them share
  meet-her/                The same age, half a century apart
  api/connection/          Looks for a shared thread; returns nothing if there isn't one
components/
  garden/                  The botanical composition, flowers, question bud
  reveal/                  Story panels, bloom sequence, phase timing
  botanical/               Seedlings, seed, climbing vine
  answer/ audio/ nav/ ui/
lib/
  types.ts                 The domain, written in the garden's vocabulary
  garden-layout.ts         Curated slots and the stem grammar
  demo-data.ts             One family, told consistently across every screen
  ai/                      The model boundary and its house rules
  voice/                   Recording and browser transcription
```

### The botanical artwork

Everything botanical is finished drawn artwork, in one of two hands. THEN is an
old botanical plate: a heavy uneven inked contour, solid fill, visible veining.
NOW is a lighter, simpler hand: one calm thin contour sitting exactly on the edge
of a pale fill, with far fewer marks. Two people drawing the same garden, both of
them finishing what they started.

The shared flower is the clearest case — its left petals in one hand, its right
petals in the other, meeting at a gold centre that belongs to neither of them.

Placement is the other half. Each specimen declares where it attaches and which
way it points, so a leaf joins a branch at its stalk rather than floating beside
it. The arrangement and the growth are code, because a branch has to be able to
draw itself on screen.

### The garden

Drawn as a single botanical composition, not a node graph. Positions come from
curated slots rather than a force-directed layout — a garden that rearranges
itself on every load does not read as a place. THEN's lines wander and carry
soft leaves; NOW's are drafted, with small square joints. Each person's history
grows as a root system out of their own corner, and the lower middle is left
empty because that is where today's question sits.

### The bloom

The reveal opens with both stories alone for the first few seconds, untouched.
Then the shared phrases come forward, two branches descend from opposite corners
and meet, and a flower opens where they meet — followed by the two short lines
and the question the discovery opened up. About five seconds end to end, and it
collapses to plain fades under `prefers-reduced-motion`.

## Status

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md).
