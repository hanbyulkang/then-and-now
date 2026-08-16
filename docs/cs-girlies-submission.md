# CS Girlies 제출용 원고 — Then & Now

폼에 그대로 붙여넣을 수 있게 **영어 원문 블록**으로 썼고, 어디에 무엇을 넣는지는 **한국어 주석**으로 달았습니다.
CS Girlies 폼의 항목 이름이 다를 수 있으니, 없는 항목은 건너뛰고 있는 항목에 가장 가까운 블록을 쓰세요.

**링크**
- 데모 — `https://then-and-now-olive.vercel.app`
- 코드 — `https://github.com/hanbyulkang/then-and-now`
- 영상 — (업로드 후 채우기)

---

## 1. 프로젝트 이름 · 한 줄 소개

> **이름**
>
> Then & Now

> **Tagline (한 줄)**
>
> A shared memory garden for two generations.

> **대안 tagline** — 폼이 더 설명적인 걸 원할 때
>
> One question a day, two generations, and the things they never knew they shared.

---

## 2. Elevator pitch (약 200자)

대부분의 해커톤 폼에 있는 짧은 요약란입니다.

> Then & Now gives two people from different generations the same question each day. Neither sees the other's answer until both have answered. Then AI quietly looks for something real the two stories share — and a flower opens that is half painted in her hand and half in yours. Over weeks, a garden grows out of everything you've told each other.

---

## 3. Inspiration

> My grandmother is seventy-four. I have asked her the same three questions my whole life: how are you, have you eaten, are you warm enough.
>
> I know she moved to a city when she was twelve. I do not know whether she was frightened. I have never asked, and I am running out of years to.
>
> The problem was never that we don't talk. It is that nobody ever hands us the question. Family history apps solve the wrong half of this — they give you a place to store answers, but no reason to ask. Then & Now hands you one question a day and makes the other person answer it too, so it is never an interview. It is two people writing in the same book.

---

## 4. What it does

> **One question a day, answered blind.** Both people get the same question. You record your answer in your own voice. Neither of you can see the other's until both are in — so nobody is performing for anyone.
>
> **The reveal.** Both stories open side by side, and for a few seconds nothing happens. Then a phrase in each one catches, two stems come up out of the two pages, and where they meet a flower opens — literally half of each of them: her half is a faded botanical plate, yours is a calmer contemporary one, joined under a single centre. No two discoveries ever open as the same flower.
>
> **The garden is the record.** Every plant in it is a story somebody actually told. Every bud is a question still waiting for an answer. Every flower on the binding is something the two of you turned out to share. It gets fuller because there is more of it — there is no level, no streak, no score, and no progress bar anywhere in the product.
>
> **The only reaction is a real question.** No hearts, no likes. After you hear her story for the first time there is one thing worth asking: *had you heard this before?* "I never knew this" and "I remember this" are not a rating — they record where that memory already stood between you, and the ones you had never heard get their own shelf in the archive.
>
> **Discoveries open the next question.** A shared thread is only worth something if it leads somewhere, so each one comes with a follow-up the two of you can actually ask each other. Send it and a new branch starts growing.
>
> **Meet Her at My Age.** A page deeper in, where you stop meeting your grandmother as your grandmother and meet the person she was at the age you are now — same first job, same living away from family, same not knowing what comes next.

---

## 5. AI가 하는 일 — "AI vs H.I." 트랙용

주최 측 테마가 AI와 인간 지능의 대비라면 이 블록이 핵심입니다. 별도 항목이 없더라도 **What it does 끝이나 How we built it 앞에 넣으면 좋습니다.**

> **AI is never the protagonist here.** It does not write, summarise, rewrite, or speak. Both voices on screen are human and unedited.
>
> What the model does is read two stories and ask one question: is there something real these two people actually share? It is allowed — and expected — to answer no. When it finds nothing you get "Two stories, kept side by side," and no flower opens. That refusal is the feature: a flower only means something because it cannot be manufactured.
>
> Getting that judgement right was most of the work. Early versions were too generous and would connect drying persimmons in 1974 to debugging CSS in 2026 under the theme "Patient Work" — technically a pattern, humanly nothing. The rule that fixed it: **what counts is a feeling, a need, or a relationship — never an activity, and never a personality trait.** With that constraint the model started finding the connections a person would actually be moved by, and rejecting the ones that only look like patterns.
>
> There is no chat interface, no sparkle icon, and the words "AI-powered" appear nowhere in the product. The only thing the user ever sees is: *something bloomed between your stories.*

---

## 6. How we built it

> **Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4**, deployed on Vercel.
>
> **The connection engine** is the AI SDK v7 with Claude (`claude-sonnet-5`), returning a zod-validated structured object: a theme, a headline, a statement, and the exact substring in each transcript that caught. Those substrings are what the reveal marks on screen, so the highlight is always the model's actual evidence rather than a decoration.
>
> **Voice** is the browser's MediaRecorder plus the Web Speech API for a live transcript. The recording is the memory; the text is a convenience, and the app keeps the audio either way.
>
> **The botany is the part we're proudest of and the part nobody asks about.** Every specimen is a watercolour painting, generated and then lifted off its sheet by treating white as nothing and everything darker as pigment — an unpremultiplied alpha key, which keeps the soft faded edges a hard threshold would chop off. Two hands: her blooms are warm and veined and gone faded, hers are cooler and simpler.
>
> A shared flower is composed at render time — the two blooms clipped on one line and joined under a single centre — so which two halves, how far it leans and how big it opens all come from the discovery itself. That is why no two of them are alike.
>
> Stems are geometry but painted: a real wash tiled behind the shape, an edge pushed about by fractal noise the way a brush wanders, and enough translucency to let the paper through. Anything that has to animate — a stem rising, a flower opening — is code. Anything that has to look like somebody made it is a painting.

---

## 7. Challenges we ran into

> **Teaching the model to say no.** Too strict and it missed threads two people would recognise instantly; too loose and it invented poetry. It took three passes and one structural rule — emotional or relational only, never an activity, never a trait — to get it finding six out of six real connections and refusing the rest.
>
> **Leaves lying across the stems they grow out of.** Mirroring a drawing in the placed frame doesn't flip it — it turns it round to face the other way. Every "flipped" leaf was pointing backwards over its own branch. It has to be mirrored about the specimen's own axis, which keeps the direction and changes only the hand.
>
> **A stretched flower is an oval.** The garden fills a page whose shape changes, and a fixed viewBox stretched to fit turned every bloom into an ellipse. The scene is 1440 units wide and however tall the page is, so the scale stays uniform and nobody's painting is distorted.
>
> **A garden that vanished on a phone.** Fitting the full width into 420px shrank a flower to a 40-pixel thumbnail and the page read as empty. On a narrow screen the view moves in on the middle instead of fitting all of it — the same drawing, fewer plants, full size.
>
> **Flat-filled stems read as sticks** no matter what shape you give them, and a taper that stops just short of nothing leaves a blunt cut across the end of every branch. Both were only visible when you looked closely, which is exactly when a product like this has to hold up.

---

## 8. Accomplishments that we're proud of

> **The pause before the bloom.** Two stories sit on screen with one closed bud between them and nothing else for several seconds. Everything in us wanted to fill that gap with a spinner or a "finding connections…" line. Leaving it empty is the single best decision in the product.
>
> **A flower that can't be faked.** The model is allowed to find nothing, and when it does, no flower opens. Every bloom in a garden is therefore evidence.
>
> **No score anywhere.** No levels, streaks, points, or progress bars. The only way the app tells you how far you and your grandmother have come is that there is more garden than there used to be.
>
> **One reaction, and it isn't a like.** Replacing hearts with "had you heard this before?" turned a reflex into a small act of attention — and it produced a genuinely new artefact: a shelf of the pieces of her life you met for the first time.
>
> **It looks like something a person made.** Nothing in the garden is one asset repeated. Every flower differs, the two generations are painted in visibly different hands, and the thing they share is literally half of each.

---

## 9. What we learned

> **Restraint is a feature you have to build.** Every empty second and every missing button in this app took more work than the thing it replaced.
>
> **Constraints make models better, not smaller.** The connection engine got dramatically more human once we told it what *doesn't* count. "Never an activity, never a trait" removed more bad output than any amount of prompt polish.
>
> **Design language is load-bearing.** Once the two generations had genuinely different hands, the shared flower could be half of each — and that single image says more about the product than any copy on the page.
>
> **Look at your own work closely.** Most of what we fixed — blunt branch tips, leaves facing backwards, a stem that read as wire — was invisible at a glance and obvious at 200%. A product about paying attention has to survive being paid attention to.

---

## 10. What's next

> **Two devices, two people.** Right now a garden lives in one browser. The data layer is already shaped for a real backend, so the next step is proper pairing, invites, and sync.
>
> **Transcription that isn't the browser's.** Web Speech is Chrome and Safari only and struggles with accented English and with older voices — exactly the people this is for. Server-side transcription fixes that.
>
> **Questions that know where you are.** A longer, better-sequenced question set that notices what the two of you have already opened.
>
> **Something you can hold.** The garden and the stories printed as a book at the end of a year, because the people this is built for do not want an app.

---

## 11. Built with

폼의 태그 입력란에 그대로.

`next.js` · `react` · `typescript` · `tailwindcss` · `anthropic-claude` · `vercel-ai-sdk` · `zod` · `web-speech-api` · `mediarecorder` · `svg` · `vercel` · `recraft`

---

## 12. Try it out

> **Live demo** — https://then-and-now-olive.vercel.app
>
> There is a link under the button on the first page — *"or look around a garden two people already grew"* — that drops you straight into a garden with a few weeks of stories in it, so you can see the whole thing without waiting for a second person.
>
> **Source** — https://github.com/hanbyulkang/then-and-now
>
> Best on a desktop browser with sound on. It works on a phone; the garden moves in close and the reveal stacks.

---

## 13. 짧은 버전들

폼 밖에서 쓸 것들 — 커뮤니티 채널, 소셜, README 첫 줄.

> **README 첫 문단**
>
> Two people from different generations answer the same question each day. Neither sees the other's answer until both are in. Then AI looks for something the two stories genuinely share — and it is allowed to find nothing. When it does find something, a flower opens that is half painted in one hand and half in the other, and it stays in a garden made entirely of what the two of them have said.

> **소셜 한 줄**
>
> I built a memory garden for me and my grandmother. Same question every day, answered blind. When our two answers turn out to be the same story, a flower opens that's half hers and half mine.

> **데모 영상 설명란**
>
> Then & Now — a shared memory garden for two generations. One question a day, answered in your own voice and kept blind until both of you are in. AI reads both stories and looks for something real they share; when it finds one, a flower opens that is half painted in each of your hands. Built with Next.js, Claude, and a lot of watercolour.

---

## 14. 제출 전 체크

- [ ] 영상 업로드하고 링크 채우기 (`docs/demo-film-script.md` 대본대로)
- [ ] 팀원 이름·역할 채우기 — 이 문서에는 비워뒀습니다
- [ ] 배포 링크 한 번 더 열어보기 (첫 로딩, 데모 링크, Reveal까지)
- [ ] 스크린샷 3–4장: 정원 / Reveal 개화 순간 / Between Us / 모바일 정원
- [ ] 폼에 트랙·테마 선택이 있으면 **5번 블록(AI가 하는 일)** 을 그 답변에 붙이기
- [ ] 커버 이미지 — 랜딩 스프레드나 개화한 Reveal 프레임

---

## 15. 정직하게 밝혀둘 것

심사자가 물어보기 전에 먼저 말하는 편이 항상 낫습니다. 필요하면 폼 아무 데나 한 줄로.

> The demo family is fictional and their photographs are generated — the app ships with a seeded garden so the whole experience can be seen without a second person. Everything the two of them say was written for the demo. The connection between any two stories, however, is found live by the model at the moment you open them: it is not scripted, and it sometimes finds nothing.
