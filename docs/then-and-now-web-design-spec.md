# Then & Now

## Web App Design Specification

### Product Line

**A shared memory garden for two generations.**

### Supporting Line

**One question at a time, discover the stories you never knew to ask.**

---

# 1. Design Objective

Then & Now는 일반적인 AI product, social network, family archive 또는 dashboard처럼 보여서는 안 된다.

사용자가 처음 웹사이트에 들어오는 순간의 느낌은:

> **“I opened a living family storybook.”**

이어야 한다.

제품의 visual narrative 자체가 제품의 의미를 설명한다.

처음:

**Then | empty space | Now**

시간이 지나면:

**Then ─── shared memories ─── Now**

마지막:

두 visual world가 서로 얽혀 하나의 garden이 된다.

---

# 2. Core Visual Concept

## Old Storybook × Modern Digital Garden

제품에는 세 가지 visual language가 존재한다.

### THEN

과거.

Visual references:

- faded family photographs
- old storybooks
- botanical illustrations
- pressed flowers
- cream paper
- subtle paper grain
- ink
- serif typography
- irregular organic lines

느낌:

**warm / tactile / nostalgic / imperfect**

---

### NOW

현재.

Visual references:

- contemporary editorial photography
- clean off-white space
- thin digital lines
- modern typography
- restrained layout
- generous whitespace

느낌:

**clear / quiet / contemporary / precise**

---

### BETWEEN

둘의 기억이 만나는 공간.

여기에서는 Then과 Now가 섞인다.

예:

Then branch:

hand-drawn botanical stem

Now branch:

clean vector line

둘이 만나면:

### Shared Flower

두 visual styles가 동시에 존재하는 새로운 botanical form.

Shared flower는 Then에도 Now에도 속하지 않는다.

**둘의 관계에 속한다.**

---

# 3. Design Principles

## 3.1 Human Before AI

사용자는 AI를 보지 않는다.

UI에서 피해야 하는 표현:

- AI Insight
- Semantic Match
- AI Analysis
- Generated Summary
- Confidence Score

대신:

> **We found something you share.**

> **A conversation is waiting to bloom.**

> **Something new grew between you.**

AI는 infrastructure이고, 사람의 이야기가 product다.

---

## 3.2 Original Voice Is Sacred

AI가 memory를 rewrite해서 더 아름다운 문장으로 만들어서는 안 된다.

항상 우선순위:

1. Original voice
2. Original transcript
3. Photo
4. Context
5. AI-discovered connection

AI output은 사람의 기억보다 visual hierarchy가 낮다.

---

# 4. Color System

전체 배경은 pure white를 사용하지 않는다.

## Base

**Canvas**
`#F7F4EC`

따뜻한 off-white.

---

## Then Palette

Paper:
`#E8DDC8`

Deep Ink:
`#40382F`

Faded Brown:
`#88745F`

Old Rose:
`#A77D75`

Botanical Sage:
`#7C876A`

---

## Now Palette

Clean Canvas:
`#FAF9F5`

Charcoal:
`#2D302F`

Muted Slate:
`#747C79`

Soft Sage:
`#9AAA94`

Cool Grey:
`#DADDD8`

---

## Shared / Bloom Palette

공유된 기억에는 지나치게 화려한 색을 사용하지 않는다.

Accent Gold:
`#C5A768`

Bloom Rose:
`#B88379`

Shared Green:
`#788D72`

꽃마다 색상은 조금씩 달라도 되지만 전체 saturation은 낮게 유지한다.

### 금지

- neon
- bright gradients
- gamified rainbow palette
- startup blue
- purple AI gradient

---

# 5. Typography

Typography 자체가 Then과 Now의 차이를 보여준다.

## Editorial / Memory

Serif.

사용처:

- questions
- memory quotes
- story titles
- Then headings
- emotional copy

추천 스타일:

**Cormorant Garamond / Libre Baskerville / Lora 계열**

---

## Interface

Sans-serif.

사용처:

- navigation
- buttons
- metadata
- dates
- controls
- labels

추천:

**Inter / Geist / Manrope 계열**

---

## Example

### Serif

> What made you happy when you were twenty?

### Sans

`GRANDMA ANSWERED · WAITING FOR YOU`

---

# 6. Global Layout

Desktop:

최대 content width 약 **1440px**.

Garden 화면은 필요하면 viewport 전체 너비 사용.

Navigation height:

**64–72px**

전체적으로 vertical whitespace를 넉넉하게 사용한다.

---

# 7. Navigation

Desktop:

왼쪽:

**Then & Now**

중앙 또는 오른쪽:

`Garden`

`Stories`

`Between Us`

오른쪽 끝:

두 사람의 작은 overlapping profile portraits.

예:

`◯ ◯`

---

Mobile:

Bottom navigation.

`Garden`

`Stories`

`Between Us`

Profile은 top-right.

---

# 8. Landing Page

## Structure

Full viewport.

좌측:

### THEN

젊은 시절의 family photo.

조금 faded.

주변에 아주 얇은 botanical illustration.

---

우측:

### NOW

현재 사진.

clean crop.

넓은 whitespace.

---

중앙:

# Then & Now

### A shared memory garden for two generations.

그 아래:

> One question at a time, discover the stories you never knew to ask.

CTA:

### Start your garden

---

페이지 가장 아래 중앙:

작은 seed 하나.

처음에는 거의 눈에 띄지 않는다.

CTA hover 시 seed에서 아주 작은 root animation이 발생한다.

---

# 9. Onboarding

## Screen 1

### Who are you growing this with?

관계 선택:

Grandma

Grandpa

Mom

Dad

Other family

---

## Screen 2

### Tell us your names.

Your name

Their name

---

## Screen 3

### Your garden is ready.

예:

# Ann & Grandma's Garden

작은 두 seedlings.

CTA:

**Invite Grandma**

Secondary:

`Copy invite link`

---

복잡한 onboarding 금지.

### 입력하지 않는 것

- hobbies
- detailed bio
- interest questionnaire
- personality
- wellness goals

---

# 10. Main Garden

Garden은 제품의 Home이다.

Dashboard를 따로 만들지 않는다.

## Header

작게:

### Grandma & Ann

**52 years between you**

연령 차이는 두 사람 birth year가 있을 경우 자동 계산.

---

## Garden Composition

좌측:

**Then Root**

오른쪽:

**Now Root**

가운데:

shared space.

처음에는 매우 작고 비어 있다.

---

초기 상태:

```
THEN                                  NOW

  🌱                                🌱


                 ◌
            Today's bud

```

---

# 11. Garden Symbol Language

Garden의 모든 botanical element에는 의미가 있다.

## Seed

아직 시작하지 않은 질문.

---

## Bud

대답을 기다리는 conversation.

---

## Leaf

한 사람이 남긴 individual memory.

---

## Branch

한 memory에서 이어진 related conversation.

---

## Flower

두 사람 사이에서 발견된 **meaningful shared experience**.

중요:

**두 사람이 답했다고 자동으로 꽃이 생기지 않는다.**

Connection이 발견되어야 한다.

---

## Root

각 사람의 accumulated personal history.

---

# 12. Today's Question

Garden 중앙의 unopened bud.

Default 상태:

작은 움직임만 존재.

hover / tap:

카드가 열린다.

### TODAY'S QUESTION

> What made you happy when you were twenty?

Status:

**Grandma answered · Waiting for you**

CTA:

### Answer

---

Grandma의 답변 내용은 reveal 전에는 보여주지 않는다.

Blind answering을 유지한다.

---

# 13. Answer Overlay

새 page로 이동하지 않는다.

Garden 위에 full-screen 또는 large modal overlay.

배경 Garden은 blur시키지 말고 약간 darken만 한다.

---

중앙:

### Today's Question

# What made you happy when you were twenty?

큰 microphone interaction.

### Hold to tell your story

---

Recording:

```
       00:18

   ∿ ∿ ∿ ∿ ∿ ∿

Release when you're done

```

---

Secondary actions:

`Write instead`

`Add a photo`

---

Primary interaction은 항상 voice.

---

# 14. Recording Complete

녹음 종료 후:

waveform이 천천히 정지.

짧은 상태:

### Saving your story…

AI processing language 금지.

이후:

### Your story is in the garden.

---

상대가 아직 답하지 않았다면:

> Grandma hasn't answered yet.

> We'll keep your story private until she does.

---

# 15. Both Stories Ready

둘 다 답하면 Garden의 bud가 약간 밝아진다.

label:

### Both stories are ready.

CTA:

# Reveal together

이 순간을 제품 내 small event처럼 취급한다.

---

# 16. Reveal Experience

웹의 넓은 horizontal space를 적극 활용한다.

화면이 중앙을 기준으로 둘로 나뉜다.

---

## LEFT — THEN

Paper texture.

Grandma's younger photo.

### GRANDMA

**1974 · Seoul · Age 20**

Voice waveform.

▶ Hear her story

Transcript.

---

## RIGHT — NOW

Clean background.

현재 portrait.

### ANN

**2026 · Seattle · Age 20**

Voice waveform.

▶ Hear her story

Transcript.

---

처음에는 **AI connection을 바로 보여주지 않는다.**

두 사람의 이야기를 먼저 읽거나 들을 시간이 필요하다.

약 2–3초 이후 connection animation 시작.

---

# 17. Connection Highlight

예:

Grandma:

> 학교 끝나고 친구들이랑 **분식 먹으러 가는 게 제일 행복했어.**

Ann:

> **Getting food with my friends after class** is probably one of my favorite things.

관련 phrase가 각각 매우 부드럽게 강조된다.

강조 효과:

underline 또는 translucent botanical highlight.

형광 marker처럼 강하지 않게.

---

# 18. Bloom Animation

Then & Now의 가장 중요한 animation.

## Phase 1

Then side에서 hand-drawn botanical stem이 중앙을 향해 자란다.

---

## Phase 2

Now side에서 thin clean digital line이 중앙으로 자란다.

---

## Phase 3

두 line이 중앙에서 만난다.

잠깐 pause.

---

## Phase 4

중앙에서 shared flower가 bloom.

---

텍스트:

### 52 years apart.

약 800ms 이후:

# Same kind of happiness.

---

꽃 이름:

### Everyday Joy

---

전체 animation:

약 **4–6초**.

너무 빠르면 emotional impact가 없다.

---

# 19. Connection Language

AI가 만든 문장은 짧아야 한다.

Bad:

> Despite being born more than five decades apart, you both seem to derive happiness from informal social interactions involving food and friends.

금지.

Good:

> **52 years apart.**

> **Same kind of happiness.**

---

다른 예:

> Different cities.

> Same feeling of starting over.

---

> Different childhoods.

> Same person they called home.

---

AI가 감정을 확신할 근거가 부족하면 단정하지 않는다.

---

# 20. Follow-Up Bud

Bloom animation 이후 꽃 아래 또는 옆에 작은 bud 등장.

label:

### A conversation waiting to bloom.

질문:

> What did friendship mean to you at twenty?

CTA:

### Ask Grandma

또는:

### Answer together

---

이 질문은 방금 발견한 connection과 existing memory context에서 생성된다.

---

# 21. Mature Garden

사용하면서 정원이 점점 커진다.

예:

```
                Leaving Home
                    🌸
                   /  \
        Family 🌸      🌿 Seattle
              /
 THEN 🌱────🌸 Everyday Joy────🌱 NOW
              \
              🌸 Belonging
                    \
                     🌸 Starting Over

```

실제 UI에서는 graph가 아니라 **organic botanical composition**으로 보여야 한다.

---

# 22. Garden Hover

Flower hover:

작은 editorial preview.

### Leaving Home

Grandma
Seoul · 1974

Ann
Seattle · 2026

> **Different cities. Similar uncertainty.**

CTA:

**Hear this story →**

---

Leaf hover:

개인 memory preview.

### Grandma · 1974

> “I remember looking out the train window…”

---

# 23. Shared Memory Detail

Flower click.

Full-page shared story.

좌측:

Grandma.

우측:

Ann.

중앙:

shared flower.

---

각 side:

- photo
- date
- place
- age
- original audio
- transcript

중앙:

### Leaving Home

> Different cities.
> Similar uncertainty.

---

가장 아래:

### Continue this conversation

AI-generated contextual question.

---

# 24. Stories Page

목적:

**Individual memories archive.**

Garden과 시각적으로 달라야 한다.

SaaS card grid 금지.

Editorial scroll 형태.

---

예:

```
1974

   [photo]

   Grandma · Seoul

   “I remember…”

        ───────

1981

        [photo]

```

현재 세대 memory도 같은 archive 안에 존재.

Filter:

`All`

`Grandma`

`Ann`

---

# 25. Between Us

목적:

**Shared themes only.**

Garden이 time + conversation + growth라면,

Between Us는:

### “What have we discovered about each other?”

를 보는 곳.

---

Visual:

Botanical map.

예:

```
             HOME
             🌸
           /    \
     FAMILY     BELONGING
       🌸          🌸
        \          /
         GROWING UP
             🌸

```

---

theme hover:

화면 양쪽에서 두 사람 사진이 나타난다.

click:

관련 shared memories.

---

# 26. Meet Her at My Age

## Status

Post-MVP / showcase feature.

하지만 high-value feature이므로 디자인은 준비한다.

---

Grandma profile:

CTA:

### Meet her at your age

page-turn transition.

---

화면:

# Grandma at 22

### Ann at 22

---

Left:

### GRANDMA · AGE 22

Seoul

First job

Living away from family

Unsure about the future

---

Right:

### ANN · AGE 22

Seattle

College

Living away from family

Unsure about the future

---

중앙:

### Different worlds.

# Same age.

이미 발견된 shared flowers가 주변에 나타난다.

---

CTA:

### Ask her something you wish someone would ask you.

이 CTA는 매우 강하므로 유지한다.

---

# 27. Photo Memories

Upload photo.

AI가 image interpretation부터 시작하지 않는다.

먼저:

# Tell me about this photo.

🎙️

사용자의 이야기가 primary source.

---

사진 자체는:

**memory trigger**

이지

**memory evidence**

가 아니다.

AI는 사용자가 이야기한 내용을 existing memories와 연결한다.

---

# 28. Reactions

일반 social reaction 금지.

❌ Like

❌ Heart count

❌ Comments

---

허용:

### I never knew this.

### I remember this too.

필요하면:

### Ask me more about this.

정도.

숫자 count를 보여주지 않는다.

---

# 29. Notifications

언어는 항상 human.

Good:

> Grandma answered today's question.

> A new memory is waiting for you.

> Something new bloomed in your garden.

> Grandma asked you something.

---

Bad:

> New AI match found.

> Semantic similarity detected.

> AI generated a follow-up.

---

# 30. Motion System

Animation은 decorative가 아니라 의미 전달 수단이다.

## Seed

작은 pulse.

---

## Bud

아주 느린 breathing motion.

---

## Branch

질문이 이어질 때 자람.

---

## Leaf

individual memory 저장 시 펼쳐짐.

---

## Flower

shared connection 발견 시만 bloom.

---

## Page Turn

Then ↔ historical perspective 전환.

---

# 31. Motion Timing

Micro interaction:

150–300ms.

Page transition:

400–700ms.

Branch grow:

1.5–2.5s.

Bloom sequence:

4–6s.

---

Reduced Motion preference가 활성화된 경우 animation을 단순 fade로 교체한다.

---

# 32. Accessibility

## Typography

본문 최소:

16px.

older-user interaction screen:

18–20px 권장.

---

## Touch Target

최소:

44×44px.

Voice button은 훨씬 크게.

---

## Contrast

Paper texture가 readability를 방해하지 않도록 한다.

Texture opacity는 매우 낮게.

---

## Voice

모든 recording에는 transcript 제공.

---

## Language

각 사용자 preferred language 저장.

Original transcript 보존.

Translation optional.

---

## Motion

`prefers-reduced-motion` 지원.

---

# 33. Mobile Layout

모바일에서도 동일한 콘텐츠와 기능을 제공한다.

별도 simplified app이 아니다.

---

## Garden

전체 garden을 축소해서 보여주기보다는:

horizontal pan / zoom

또는

현재 active flower 중심으로 focus.

---

## Reveal

Desktop:

Then | Now

Mobile:

Then

↓

Shared connection

↓

Now

단, 두 답변을 비교할 수 있다는 느낌은 유지한다.

---

# 34. Desktop Layout

Desktop은 Then & Now의 가장 강한 presentation surface.

특히:

- split reveal
- branch meeting animation
- full garden
- Between Us botanical map

에 적극 활용한다.

---

# 35. Component Library

최소 component:

### Navigation

### ProfilePair

### QuestionBud

### VoiceRecorder

### StoryLeaf

### SharedFlower

### GardenBranch

### StoryPreview

### RevealPanel

### ConnectionStatement

### FollowUpBud

### EditorialStoryEntry

---

# 36. MVP Screen List

실제로 구현해야 하는 화면:

1. Landing
2. Pair onboarding
3. Garden
4. Answer overlay
5. Waiting state
6. Reveal
7. Shared Memory detail
8. Stories archive

Between Us는 시간이 충분하면 실제 구현.

Meet Her at My Age는 prototype 가능.

---

# 37. MVP Interaction Priority

## Priority 0

### Garden

---

## Priority 1

### Voice answer

---

## Priority 2

### Blind answer + Reveal

---

## Priority 3

### Connection detection

---

## Priority 4

### Bloom animation

---

## Priority 5

### Follow-up bud

---

## Priority 6

Story archive.

---

나머지는 이후.

---

# 38. Demo-Critical State

Demo를 위해 반드시 pre-populate할 memory 몇 개를 준비한다.

예:

### Everyday Joy

Then:

friends + food after school

Now:

friends + food after class

---

### Leaving Home

Then:

moving Seoul

Now:

moving Seattle

---

### Family

Then:

mother calling after work

Now:

calling Grandma from Seattle

---

Garden이 최소 3–5개의 flower를 가진 상태를 demo final state로 사용한다.

---

# 39. Signature Scene

Then & Now를 한 장면으로 설명해야 한다면 이것이다.

왼쪽:

Grandma의 오래된 사진과 목소리.

오른쪽:

현재의 사진과 목소리.

관련 문장이 highlight.

두 branch가 서로에게 다가간다.

중앙에서 꽃이 핀다.

그리고:

### 52 years apart.

# Same feeling.

꽃 아래 새로운 bud.

### A conversation waiting to bloom.

이 장면이 제대로 만들어지면 제품 설명 대부분이 필요 없어진다.

---

# 40. Final Design Test

디자인 완성 후 모든 화면을 다음 질문으로 평가한다.

### Does this feel like a dashboard?

Yes → 다시 디자인.

### Is AI more visible than the people?

Yes → hierarchy 수정.

### Is the Garden decorative rather than meaningful?

Yes → element 의미 수정.

### Could this interaction belong to any other AI app?

Yes → Then & Now만의 interaction으로 수정.

### Does the screen make me want to ask someone in my family a question?

Yes → 성공.

---

# Final Visual Thesis

At the beginning:

**two generations live on opposite sides of the screen.**

At the end:

**you can no longer tell where one garden ends and the other begins.**

That transformation is the visual story of Then & Now.