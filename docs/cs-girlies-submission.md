# CS Girlies 제출 — 폼 항목별 원고

Devpost 폼의 칸 순서 그대로입니다. 영어 블록은 **그대로 복사해서 붙여넣으면** 됩니다.

---

## ① About the project

폼의 큰 마크다운 칸. **아래 전체를 한 번에** 붙여넣으세요. 헤딩은 Devpost가 그대로 렌더합니다.

> ## Inspiration
>
> My grandmother is seventy-four. I have asked her the same three questions my whole life: how are you, have you eaten, are you warm enough.
>
> I know she moved to a city when she was twelve. I do not know whether she was frightened. I have never asked, and I am running out of years to.
>
> The problem was never that we don't talk. It is that nobody ever hands us the question. Family-history apps solve the wrong half of this — they give you somewhere to store answers but no reason to ask, and they quietly turn the older person into a subject being interviewed. I wanted something where we are both answering.
>
> ## What it does
>
> **One question a day, answered blind.** Both of you get the same question. You answer in your own voice. Neither of you can see the other's answer until both are in — so nobody is performing for anyone.
>
> **The reveal.** Both stories open side by side, and for a few seconds nothing happens at all. Then a phrase in each one catches, two stems come up out of the two pages, and where they meet a flower opens that is literally half of each of you: her half painted as a faded botanical plate, yours as a calmer contemporary one, joined under a single centre. No two discoveries ever open as the same flower.
>
> **The garden is the record.** Every plant in it is a story somebody actually told. Every bud is a question still waiting for an answer. Every flower on the binding is something the two of you turned out to share. It gets fuller because there is more of it — there is no level, no streak, no score, and no progress bar anywhere in the product.
>
> **The only reaction is a real question.** No hearts, no likes. After you hear her story for the first time there is exactly one thing worth asking: *had you heard this before?* "I never knew this" and "I remember this" are not a rating — they record where that memory already stood between you, and the ones you had never heard get their own shelf in the archive.
>
> **Every discovery opens the next question.** A shared thread is only worth something if it leads somewhere, so each one arrives with a follow-up the two of you can actually ask each other. Send it and a new branch starts growing.
>
> **Meet Her at My Age.** A page deeper in, where you stop meeting your grandmother as your grandmother and meet the person she was at the age you are now — same first job, same living away from family, same not knowing what comes next.
>
> ## Where the AI is, and where it isn't
>
> The AI is never the protagonist here. It does not write, summarise, rewrite, or speak. Both voices on screen are human and unedited.
>
> What the model does is read two stories and ask one question: is there something real these two people actually share? **It is allowed — and expected — to answer no.** When it finds nothing you get "Two stories, kept side by side," and no flower opens. That refusal is the feature. A flower means something precisely because it cannot be manufactured.
>
> Getting that judgement right was most of the work. Early versions were too generous: they would connect drying persimmons in 1974 to debugging CSS in 2026 under the theme "Patient Work" — technically a pattern, humanly nothing. The rule that fixed it was structural, not stylistic:
>
> > What counts is a feeling, a need, or a relationship — never an activity, and never a personality trait.
>
> With that constraint the model started finding the connections a person would actually be moved by, and rejecting the ones that only look like patterns. There is no chat interface, no sparkle icon, and the phrase "AI-powered" appears nowhere in the product. The only thing a user ever sees is: *something bloomed between your stories.*
>
> ## How we built it
>
> **Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4**, deployed on Vercel.
>
> The connection engine is the **Vercel AI SDK v7 with Claude**, returning a zod-validated object: a theme, a headline, a statement, a follow-up question, and the exact substring in each transcript that caught. Those substrings are what the reveal marks on screen, so the highlight is always the model's own evidence rather than decoration.
>
> Voice is the browser's **MediaRecorder** plus the **Web Speech API** for a live transcript. The recording is the memory and the text is a convenience — the app keeps the audio either way.
>
> **The botany is the part we are proudest of and the part nobody asks about.** Every specimen is a watercolour painting, lifted off its sheet by treating white as nothing and everything darker as pigment — an unpremultiplied alpha key, which keeps the soft faded edges that a hard threshold would chop off. Two hands: her blooms are warm and veined and gone faded, yours are cooler and simpler, and each has its own leaf.
>
> A shared flower is composed at render time — the two blooms clipped on one line and joined under a single centre — so which two halves, how far it leans and how wide it opens all come from the discovery itself. That is why no two are alike.
>
> Stems are geometry, but painted: a real wash tiled behind the shape, an edge pushed about by fractal noise the way a brush wanders, and enough translucency to let the paper through. The rule throughout: anything that has to animate is code, anything that has to look like somebody made it is a painting.
>
> ## Challenges we ran into
>
> **Teaching the model to say no.** Too strict and it missed threads two people would recognise instantly; too loose and it invented poetry. Three passes and one structural rule got it to six out of six real connections, with the invented ones refused.
>
> **Leaves lying back across the stems they grow out of.** Mirroring a drawing in the placed frame does not flip it — it turns it round to face the other way, so every "flipped" leaf was pointing backwards over its own branch. It has to be mirrored about the specimen's own axis, which changes the hand and keeps the direction.
>
> **A stretched flower is an oval.** The garden fills a page whose shape changes, and a fixed viewBox stretched to fit turned every bloom into an ellipse. The scene is now 1440 units wide and however tall the page happens to be, so the scale stays uniform and nobody's painting is distorted.
>
> **A garden that vanished on a phone.** Fitting the full width into 420px shrank a flower to a 40-pixel thumbnail and the page read as empty. On a narrow screen the view moves in on the middle instead of fitting all of it — the same drawing, fewer plants, full size.
>
> **Flat-filled stems read as sticks** no matter what shape you give them, and a taper that stops just short of nothing leaves a blunt cut across the end of every branch. Both were invisible at a glance and obvious at 200% — which is exactly when a product about paying attention has to hold up.
>
> ## Accomplishments that we're proud of
>
> **The pause before the bloom.** Two stories sit on screen with one closed bud between them and nothing else for several seconds. Everything in us wanted to fill that gap with a spinner or a "finding connections…" line. Leaving it empty is the best decision in the product.
>
> **A flower that cannot be faked.** The model is allowed to find nothing, and when it does, nothing opens. Every bloom in a garden is therefore evidence.
>
> **No score anywhere.** No levels, streaks, points, or progress bars. The only way the app tells you how far the two of you have come is that there is more garden than there used to be.
>
> **One reaction, and it isn't a like.** Replacing hearts with "had you heard this before?" turned a reflex into a small act of attention — and produced a genuinely new artefact: a shelf holding the pieces of her life you met for the first time.
>
> ## What we learned
>
> **Restraint is a feature you have to build.** Every empty second and every missing button took more work than the thing it replaced.
>
> **Constraints make models better, not smaller.** The connection engine became dramatically more human once we told it what *doesn't* count. "Never an activity, never a trait" removed more bad output than any amount of prompt polish.
>
> **Design language is load-bearing.** Once the two generations had genuinely different hands, the shared flower could be half of each — and that single image says more about the product than any copy on the page.
>
> **Look at your own work closely.** Almost everything we fixed was invisible at a glance. A product about paying attention has to survive being paid attention to.
>
> ## What's next
>
> **Two devices, two people.** A garden currently lives in one browser. The data layer is already shaped for a real backend, so the next step is proper pairing, invites, and sync.
>
> **Transcription that isn't the browser's.** Web Speech is Chrome and Safari only and struggles with accented English and with older voices — exactly the people this is for.
>
> **Questions that know where you are.** A longer, better-sequenced set that notices what the two of you have already opened.
>
> **Something you can hold.** The garden and the stories printed as a book at the end of a year, because the people this is built for do not want an app.
>
> ---
>
> *The demo family is fictional and their photographs are generated, so the whole experience can be seen without a second person. Everything they say was written for the demo. The connection between any two stories, however, is found live by the model at the moment you open them — it is not scripted, and it sometimes finds nothing.*

---

## ② Built with

태그 칸. 최대 25개인데 **14개면 충분합니다** — 관련 없는 걸 채우면 오히려 흐려집니다. 하나씩 입력하세요.

> next.js
> react
> typescript
> tailwind
> anthropic-claude
> vercel-ai-sdk
> zod
> web-speech-api
> mediarecorder
> svg
> css
> vercel
> node.js
> recraft

---

## ③ "Try it out" links

두 개 넣으세요.

> https://then-and-now-olive.vercel.app

> https://github.com/hanbyulkang/then-and-now

**첫 링크 아래 설명을 쓸 수 있으면** — 심사자가 두 번째 사람 없이도 다 볼 수 있다는 걸 알려주는 게 중요합니다.

> On the first page, under the button, there is a link that says "or look around a garden two people already grew." It drops you into a garden with a few weeks of stories in it, so you can see the whole thing — including a live reveal — without a second person.

---

## ④ Image gallery

**3:2 비율, JPG/PNG, 5MB 이하, 최대 15장.** 6장이면 충분합니다. **1800 × 1200** 으로 캡처하세요.

**찍는 법** — 브라우저 창을 1800 폭으로 두고 전체화면 캡처한 뒤 3:2로 크롭하거나, 데모 영상에서 프레임을 뽑아 쓰세요. **첫 장이 갤러리 커버**가 되니 가장 좋은 걸 앞에 두세요.

| 순서 | 화면 | 무엇이 보여야 하나 |
|---|---|---|
| 1 | `/reveal/c_the_call` — 개화 직후 | **커버.** 가운데 반반인 꽃, 양쪽 이야기, 노란 마커, "Two generations apart. / The same phone call." |
| 2 | `/garden` | 자란 정원 전체. 아치로 선 꽃 셋과 이름, 오늘의 질문 노트 |
| 3 | `/garden` — 꽃에 호버한 상태 | 나머지가 흐려지고 노트가 열린 순간 |
| 4 | `/between-us` | 조각 ← 줄기 → 꽃의 field journal 구성 |
| 5 | `/meet-her` | "Grandma at 22 / Ann at 22", "Different worlds. Same age." |
| 6 | 모바일 `/reveal/c_the_call` | 세로로 쌓인 두 페이지. **폰 목업 안에 넣어** 3:2 프레임을 채우세요 |

**캡션을 쓸 수 있으면** (각 이미지 아래):

> 1. A flower that is half painted in her hand and half in mine — it only opens when the model finds something real.
> 2. The garden is made of what the two of them have said. No levels, no streaks, no score.
> 3. Lean toward a flower and it tells you which two memories fed it.
> 4. Between Us — a field journal of everything they turned out to share.
> 5. Meet her at the age you are now.
> 6. The same reveal on a phone: the two pages stack and the meeting happens in the gap.

---

## ⑤ Video demo link

YouTube / Vimeo. `docs/demo-film-script.md` 대본대로 찍은 4:21짜리를 올리고 링크를 넣으세요.

**YouTube 제목**

> Then & Now — a shared memory garden for two generations

**YouTube 설명란**

> Two people from different generations answer the same question each day, in their own voice. Neither sees the other's answer until both are in. Then AI reads both stories and looks for something they genuinely share — and it is allowed to find nothing. When it does find something, a flower opens that is half painted in each of their hands, and it stays in a garden made entirely of what the two of them have told each other.
>
> Built with Next.js, Claude, and a lot of watercolour.
>
> Try it: https://then-and-now-olive.vercel.app
> Code: https://github.com/hanbyulkang/then-and-now

---

## ⑥ Which track are you submitting to?

**트랙 목록을 알려주시면 골라드리겠습니다.** 폼에 뜨는 선택지를 그대로 붙여주세요.

일반적으로 이런 유형이 있고, 각각에 맞는 한 줄 근거입니다:

- **AI 관련 트랙** — 가장 잘 맞습니다. 근거: *AI가 UI의 주인공이 아니라 뒤에서 판단만 하고, "없다"고 답할 권리를 가진 시스템.* 위 ① 원고의 "Where the AI is, and where it isn't" 섹션이 그대로 답변이 됩니다.
- **디자인/크리에이티브 트랙** — 두 세대를 실제로 다른 손으로 그리고, 공유한 것은 문자 그대로 반반인 꽃으로 합성한 것.
- **소셜 임팩트/커뮤니티 트랙** — 노인과 젊은 세대 사이의 대화를 인터뷰가 아니라 상호 답변으로 만든 것.

---

## 제출 전 체크

- [ ] ① 원고 붙여넣고 Devpost 미리보기에서 헤딩 렌더 확인
- [ ] 영상 업로드 후 ⑤ 링크 채우기
- [ ] 이미지 6장, 3:2, 첫 장이 커버
- [ ] 배포 링크 열어서 첫 로딩 → 데모 링크 → Reveal까지 한 번 통과
- [ ] 트랙 선택
- [ ] 팀원 이름·역할
