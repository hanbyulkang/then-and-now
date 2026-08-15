# Then & Now

### *A shared memory garden for two generations.*

> **One question at a time, discover the stories you never knew to ask.**

---

## 1. Project Overview

**Then & Now**는 서로 다른 두 세대가 같은 질문에 답하고, 서로의 이야기를 발견하며, 시간이 지날수록 하나의 **Shared Memory Garden**을 함께 만들어가는 웹앱이다.

예를 들어 할머니와 손녀가 연결되어 있다면 매일 같은 질문을 받는다.

> **What did friendship mean to you when you were 20?**

할머니:

> “우리는 약속도 없이 친구 집에 찾아가곤 했어.”

손녀:

> “친한 친구들과도 만나기 전에 항상 문자부터 해.”

두 답변은 나란히 나타나고, AI는 이야기 안의 사람·장소·시간·주제를 연결한다.

시간이 지나면서 둘의 기억은 단순한 transcript archive가 아니라 하나의 **살아있는 정원**으로 자란다.

---

# 2. Core Problem

우리는 가족과 가까이 지내면서도 의외로 서로의 과거를 거의 모른다.

특히 세대가 다르면 대화는 쉽게 반복된다.

> “밥 먹었어?”

> “학교는 어때?”

> “건강은 괜찮아?”

하지만 우리가 정말 알고 싶은 이야기는 질문하지 않으면 영원히 듣지 못할 수도 있다.

- 처음 사랑했던 사람
- 어린 시절 가장 좋아했던 장소
- 실패했던 순간
- 부모와의 관계
- 친구와 놀던 방식
- 처음 집을 떠났던 날
- 젊었을 때 가지고 있던 꿈

기억은 존재하지만, **어떤 질문을 해야 하는지 모르기 때문에 발견되지 않는다.**

### Problem Statement

> **Families don't necessarily lack stories.**
> **They lack the questions that uncover them.**

---

# 3. Product Thesis

기존 가족 기록 서비스:

**“기억을 저장하자.”**

Then & Now:

### **“기억을 발견하자.”**

AI의 역할도 이야기를 대신 쓰는 것이 아니다.

AI는 이미 나온 이야기를 이해하고,

> **“What should I ask next?”**

를 찾는다.

---

# 4. Target Users

## Primary

서로 다른 세대의 가족 2명.

예:

- Grandparent ↔ Grandchild
- Parent ↔ Child
- Older sibling ↔ Younger sibling
- Aunt/Uncle ↔ Niece/Nephew

Hackathon MVP에서는 **2인 pair**만 지원한다.

가족 전체 그룹은 만들지 않는다.

---

# 5. Core Experience

제품의 모든 것을 이 루프로 압축한다.

## Ask → Tell → Discover → Grow

### ① Ask

두 사람에게 같은 질문이 전달된다.

> **What did “home” mean to you growing up?**

---

### ② Tell

사용자는 글을 쓰지 않아도 된다.

큰 버튼 하나.

🎙️ **Hold to tell your story**

원하는 언어로 이야기한다.

---

### ③ Discover

두 답변을 함께 보여준다.

## THEN

> “우리 집에서는 저녁이면 항상 온 가족이 같이 밥을 먹었어.”

## NOW

> “나는 친구들과 FaceTime 할 때 집에 있는 기분이 들어.”

AI는 둘 사이에서 발견된 관계를 보여준다.

**Shared theme**

🏠 Belonging

---

### ④ Grow

이 이야기가 Memory Garden에 새로운 node가 된다.

```
               🌸 Home
              /       \
       🌿 Family     🌿 Friends
          |              |
      Grandma            You

```

새로운 이야기가 쌓일수록 정원이 커진다.

---

# 6. The Four MVP Features

48시간 동안 **딱 네 개를 제대로 만든다.**

---

## Feature 1 — Daily Shared Question

매일 또는 사용자가 원할 때 두 사람에게 **같은 질문 하나**를 제공한다.

카테고리 예시:

- Childhood
- Home
- Friendship
- Dreams
- Food
- School
- Love
- Family
- Traditions
- Firsts
- Difficult moments
- Happiness

질문 예시:

> What did you do for fun when you were 15?

> What food always reminds you of home?

> Who was your closest friend growing up?

> What did you think your life would look like at my age?

> What is something your parents taught you that you still remember?

### 중요한 원칙

질문은 trivia가 아니라 **story trigger**여야 한다.

Bad:

> Where did you live when you were 10?

Good:

> What do you remember seeing when you looked outside your childhood bedroom?

---

# Feature 2 — Voice Memory

답변의 기본 방식은 **voice-first**.

### Screen

> **What did you dream of becoming when you were young?**

큰 microphone button.

🎙️ **Hold to tell your story**

사용자가 한국어로 말해도 된다.

---

### 저장되는 것

- Original audio
- Original transcript
- Optional translated transcript
- Date
- Question
- Speaker
- Extracted memory concepts

예:

```
Speaker
Grandma

Language
Korean

Topics
Busan
Childhood
Mother
School

People
Mother

Places
Busan

Time
Age 12

```

### 중요한 원칙

**AI-generated polished story로 원문을 대체하지 않는다.**

사용자의 원래 목소리와 표현이 중심이다.

---

# Feature 3 — AI Memory Thread

Then & Now의 핵심 AI 기능.

AI는 단순히 다음 random question을 만드는 것이 아니다.

기존 memory graph를 읽고:

- 이미 이야기한 것
- 언급했지만 깊게 들어가지 않은 것
- 새로운 연결 가능성이 있는 것

을 찾는다.

---

### Example

Grandma says:

> “When I was twelve, our family moved from Busan to Seoul.”

Memory state:

```
Known
- childhood → Busan
- age 12 → moved to Seoul
- mother → mentioned previously

Unexplored
- reason for move
- last day in Busan
- first impression of Seoul
- relationship with mother during move

```

AI가 질문:

> **What do you remember about your last day in Busan?**

다음 답변:

> “My mother packed kimbap for the train.”

그러면 graph:

```
Busan
  |
Moving
  |
Train
 /   \
Food  Mother

```

이런 식으로 memory thread가 자연스럽게 확장된다.

---

# Feature 4 — Shared Memory Garden

이게 **제품의 visual identity이자 killer feature**다.

단순 timeline을 만들지 않는다.

각 기억을 작은 식물/꽃/가지로 표현한다.

### 기본 구조

**Person**
→ **Theme**
→ **Memory**

예:

```
                  🌸 HOME
                 /       \
          🌿 Childhood   🌿 Family
             |              |
         🪻 Busan        🌼 Mother
             |
         🚂 Moving

```

두 사람의 기억에서 같은 theme이 발견되면 가지가 연결된다.

---

## Same Question, Different Time

Garden에서 가장 중요한 특별 node.

같은 질문에 대한 두 세대의 답변을 나란히 보여준다.

### Question

> **What did friendship mean to you at 20?**

### THEN

👵

> “친구 집에는 그냥 찾아갔어. 전화할 필요도 없었지.”

### NOW

👩

> “친구랑 만나기 전에도 거의 항상 문자해.”

그리고 가운데:

### What stayed the same

**Showing up for people matters.**

### What changed

**How we stay connected.**

AI가 둘의 삶을 평가하지 않고 **connection만 보여준다.**

---

# 7. Primary User Flow

## First Visit

### Screen 1

# Then & Now

**There are stories in your family you've never thought to ask about.**

`Start a garden`

---

## Screen 2 — Pair

> **Who are you growing this garden with?**

선택:

- Grandparent
- Parent
- Other family member

이름 입력.

예:

`Grandma`

---

## Screen 3 — Invite

### Your garden is ready.

QR 또는 invite link.

> **Invite Grandma**

Hackathon에서는 실제 SMS integration 필요 없음.

Copy link만 있으면 충분.

---

# 8. Home Screen

홈에서는 모든 걸 보여주지 않는다.

### 오늘의 질문

가장 크게.

---

**Today's Question**

### What did home feel like when you were young?

👵 Grandma

`Waiting for her story`

👤 You

`Tell your story`

🎙️

---

아래:

🌱 **Garden**

`12 memories · 4 shared themes`

---

# 9. Answer Screen

질문.

> **What food reminds you most of home?**

아래 큰 마이크.

### 🎙 Hold to tell your story

녹음 중:

```
00:18

〰️〰️〰️〰️〰️

Release when you're done

```

완료.

AI processing.

---

# 10. Story Card

### Grandma · Aug 15

🔊 **Play original voice**

> “When I came home from school, my mother used to make…”

Optional:

`View English translation`

Tags:

`#mother`

`#food`

`#childhood`

---

그리고:

### 🌱 New memory added to your garden

작은 animation.

---

# 11. Garden Interaction

사용자가 Garden node를 클릭하면 작은 memory card가 열린다.

예:

🌼 **Mother**

연결된 이야기:

- Grandma's train lunch
- Childhood kitchen
- First recipe she learned
- Mother's advice

AI가 다음 potential thread도 보여준다.

> **There's more to discover here.**

### Ask:

> “What did your mother cook when you were sick?”

---

# 12. AI Architecture

복잡한 agent system을 만들 필요 없다.

### Pipeline

```
Voice
 ↓
Speech-to-Text
 ↓
Memory Extraction
 ↓
Structured JSON
 ↓
Memory Graph
 ↓
Question Selection
 ↓
Garden Visualization

```

---

## Memory Extraction Schema

예:

```
{
  "speaker": "grandmother",
  "topics": ["childhood", "moving"],
  "people": ["mother"],
  "places": ["Busan", "Seoul"],
  "time_refs": ["age 12"],
  "objects": ["train", "kimbap"],
  "emotions": ["nostalgia"],
  "relationships": [
    ["Busan", "moving"],
    ["mother", "kimbap"],
    ["moving", "train"]
  ]
}

```

---

# 13. AI Follow-Up Logic

AI에게 그냥:

> Generate another question.

이라고 하지 않는다.

입력:

1. 현재 이야기
2. 기존 memory graph
3. 이미 물어본 질문
4. unexplored entities

AI가 후보 3개를 생성.

예:

```
Candidate A
What did you miss most about Busan?

Candidate B
What was your first day in Seoul like?

Candidate C
What do you remember eating on the train?

```

그리고 가장 새로운 thread를 여는 질문 하나를 선택한다.

---

# 14. AI Philosophy

이건 demo/presentation에서 반드시 설명한다.

### AI does not write your memories.

### AI does not decide what your memories mean.

### AI helps you find the next question worth asking.

이게 Then & Now에서 AI를 사용하는 이유다.

---

# 15. Accessibility

Accessibility는 feature가 아니라 기본 구조다.

## Voice First

keyboard typing 최소화.

특히 older users에게 유리하다.

---

## Large Touch Targets

버튼:

🎙️ **Tell your story**

같이 크게.

---

## Language

각자 편한 언어로 말할 수 있다.

예:

Grandma → Korean

Granddaughter → English

원본은 그대로 보존.

원한다면 translation 제공.

---

## Simple Navigation

Bottom nav는 최대 3개.

`Today`

`Garden`

`Us`

끝.

---

# 16. Visual Direction

### 분위기

❌ 병원 앱

❌ productivity dashboard

❌ 기업 SaaS

---

원하는 느낌:

**warm / nostalgic / organic / intimate**

- 종이
- 오래된 사진
- 꽃
- pressed flower
- 작은 handwritten annotation
- 부드러운 movement

Garden은 cartoon game보다는 **illustrated memory book** 느낌이 좋다.

---

# 17. Brand

# Then & Now

이름 아래:

### **Stories grow when we share them.**

또는:

### **One question. Two generations.**

둘 다 사용 가능.

---

# 18. Emotional Hook

프로젝트 전체를 관통하는 메시지:

> **We assume there will always be another time to ask.**

하지만 가족 이야기는 질문하지 않으면 사라질 수 있다.

그래서 Then & Now는 단순 archive가 아니라:

### **a reason to ask today.**

---

# 19. Demo Story

Demo를 실제 기능 순서대로 설명하면 안 된다.

**한 가족의 이야기**처럼 보여준다.

---

## 0–10 sec

검은 화면.

할머니 목소리.

> “When I was twenty, I thought I would become a teacher.”

오래된 사진.

---

## 10–20 sec

Then & Now 등장.

> **There are stories we love that we've never thought to ask about.**

---

## 20–35 sec

Today's Question.

> What did you dream of becoming?

Grandma 답변.

User 답변.

---

## 35–50 sec

Same Question, Different Time.

### THEN

Teacher.

### NOW

Researcher.

가운데 작은 연결.

**Both wanted to understand people.**

---

## 50–65 sec

AI가 기존 이야기에서 새로운 thread 발견.

> “You mentioned leaving Busan when you were twelve.”

### Ask next

> **What do you remember about your last day there?**

---

## 65–80 sec

Grandma가 답변.

Garden에 새로운 flower가 피어남.

카메라가 zoom out.

---

## 80–90 sec

전체 garden.

### 42 stories

### 17 shared memories

그리고 마지막 문장.

> **You don't know which story will be the last one you get to ask.**

# THEN & NOW

### One question. Two generations.

---

# 20. 48-Hour Scope

## MUST

- Responsive web app
- Two-person pair
- Question system
- Voice recording
- Speech-to-text
- Memory extraction
- AI follow-up
- Memory Garden
- Same Question, Different Time
- Original audio playback
- Basic translation

---

## NICE TO HAVE

시간 남으면:

- Photo attachment
- Garden animation
- Shareable memory card
- PWA install
- notification mockup

---

## DO NOT BUILD

48시간 동안 절대 하지 않는다.

- Family group
- Full social network
- Public profiles
- Likes/comments
- Complex authentication
- Native iOS
- Native Android
- Video memories
- AI avatars
- Voice cloning
- Gamification streak
- Leaderboard
- Calendar
- Genealogy tree
- Physical book ordering

---

# 21. Tech Stack

### Frontend

Next.js
TypeScript
Tailwind

---

### Backend

Supabase

- auth
- pair
- memories
- questions
- graph state
- audio storage

---

### AI

Speech-to-text

-

LLM structured extraction

-

follow-up generation

-

cross-generation theme matching

---

### Visualization

첫 선택:

**custom SVG / simple React visualization**

Garden을 너무 generic한 graph처럼 만들면 안 된다.

React Flow를 내부적으로 사용해도 **기본 node 디자인은 숨기고 직접 styling**한다.

---

# 22. Minimal Data Model

### User

```
id
name
generation_role
preferred_language

```

### Pair

```
id
user_a
user_b
created_at

```

### Question

```
id
text
category
parent_memory_id?

```

### Memory

```
id
user_id
question_id
audio_url
transcript_original
translation
created_at

```

### Memory Entity

```
memory_id
type
value

```

### Connection

```
source_entity
target_entity
relationship

```

---

# 23. Two-Person Team Split

## Person A — Product / Frontend

- UI
- recording UX
- responsive layout
- Memory Garden
- animations
- Same Question page
- final demo polish

## Person B — AI / Backend

- Supabase
- audio storage
- transcription
- extraction schema
- follow-up question generation
- theme matching
- pair state

둘이 마지막 6–8시간은 기능 추가 금지.

### 오직:

- bugs
- animation
- sample data
- copy
- demo
- polish

---

# 24. Hackathon Success Criteria

MVP가 성공했다고 판단할 조건은 딱 다섯 개다.

### 1.

처음 보는 사람이 **10초 안에 무슨 제품인지 이해한다.**

### 2.

실제로 voice를 녹음하면 **새로운 memory가 Garden에 생긴다.**

### 3.

AI가 이전 답변과 연결된 **구체적인 다음 질문**을 만든다.

### 4.

두 사람이 같은 질문에 답했을 때 **Then / Now comparison**이 생긴다.

### 5.

마지막 Garden 화면을 screenshot만 봐도 **프로젝트를 기억한다.**

---

# 25. The Pitch

### 10-second version

> **Then & Now helps two generations discover each other's stories, one question at a time, and turns those memories into a shared garden that grows with them.**

---

### Core line

> **AI shouldn't write our memories.**
> **It should help us ask about them before they're gone.**

---

# 26. Why This Can Win

Then & Now의 강점은 단순히 가족 기록 서비스라는 데 있지 않다.

하나의 프로젝트 안에서:

**Happiness**

→ 가족과의 connection

**Wellness**

→ social belonging

**Accessibility**

→ voice-first + multilingual

**AI**

→ intelligent memory discovery

**Design**

→ Shared Memory Garden

**Human story**

→ 실제 가족의 목소리

를 하나의 경험으로 연결한다.

그리고 가장 중요한 점:

### Demo를 보고 나서 기억할 장면이 있다.

> **할머니의 이야기가 끝나는 순간 정원에 새로운 꽃이 피어난다.**

그 장면이 Then & Now다.

---

# Final MVP Definition

**Then & Now is not a family archive.**

**It is not an AI interviewer.**

**It is not a genealogy app.**

## It is a shared memory garden that gives two generations a reason to ask each other one more question.