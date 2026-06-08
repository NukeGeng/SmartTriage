---
name: smarttriage-frontend-redesign
version: 1.0.0
description: >
  Product-specific frontend redesign skill for SmartTriage. Use this together with
  component-structure and anti-slop-ui whenever redesigning the SmartTriage web app.
  This skill defines the UX direction, screen hierarchy, mascot behavior, AI-first
  interaction model, navigation, and visual product language for the SmartTriage
  frontend. The goal is to transform the app from a generic CRUD ticket dashboard
  into an AI-assisted triage command center.
---

# SmartTriage Frontend Redesign Skill

## 0. Purpose

SmartTriage is not a normal ticket management system.

The frontend must communicate this product promise:

> SmartTriage helps a school receive student reports, classify them with ML, prioritize urgent cases, detect related reports, and guide staff toward faster resolution.

Every redesigned screen must make the AI triage value visible. The interface must not feel like a basic CRUD admin panel.

Use this skill when working on:

- Next.js frontend redesign
- dashboard UI/UX
- ticket creation flow
- ticket detail screen
- AI analysis display
- triage cockpit
- incident grouping
- AI review queue
- ML feedback loop
- mascot / floating assistant
- navigation and layout polish
- demo mode / guided tour

This skill must be applied together with:

1. `component-structure`
2. `anti-slop-ui`

`component-structure` owns decomposition, folder structure, naming, and data separation.
`anti-slop-ui` owns visual craft, color, motion, typography, and layout quality.
This skill owns SmartTriage-specific UX, product logic, screen purpose, and mascot behavior.

---

## 1. Product UX Direction

### Target feeling

The app should feel like:

```txt
AI-assisted triage command center for student issue handling
```

Not like:

```txt
Generic admin dashboard
Generic ticket CRUD app
Plain school support portal
```

### Emotional register

Use a calm but high-confidence operational interface:

- technical precision
- fast triage energy
- helpful AI guidance
- trustworthy school/enterprise tone
- visual clarity under pressure

### Core metaphor

SmartTriage is a control room.

The UI should help users answer:

1. What happened?
2. How urgent is it?
3. Which department should handle it?
4. Are there similar reports?
5. What should staff do next?
6. Does AI need human review?
7. Can this improve future model training?

---

## 2. Required Primary Screens

The redesigned frontend must include these major screens.

### Student-facing

```txt
/student/tickets/new
/student/tickets
/student/tickets/[id]
```

Purpose:

- submit a student report
- see report status
- understand what AI detected
- feel reassured that the report was routed properly

### Admin / staff-facing

```txt
/admin/triage
/admin/tickets
/admin/tickets/[id]
/admin/incidents
/admin/incidents/[id]
/admin/review
/admin/ml-feedback
/admin/model-info
/demo
```

Purpose:

- operate the triage workflow
- identify high-priority reports
- inspect AI decisions
- group related reports into incidents
- correct low-confidence predictions
- export feedback data for ML improvement
- demonstrate the product in 3-5 minutes

---

## 3. Navigation Rules

Navigation must be role-aware.

### Student menu

```txt
- Gửi phản ánh
- Phản ánh của tôi
- Demo Flow
```

### Staff/Admin menu

```txt
- Triage Cockpit
- Ticket Queue
- Incident Groups
- AI Review Queue
- ML Feedback Loop
- Analytics
- Model Info
- Demo Flow
```

### Naming rules

Avoid generic labels when the AI value matters.

Prefer:

```txt
Triage Cockpit
AI Review Queue
Incident Groups
ML Feedback Loop
AI Analysis
Priority Breakdown
```

Avoid:

```txt
Dashboard
Management
List
Data
Page
```

Use Vietnamese labels if the current app language is Vietnamese, but preserve strong product meaning.

Example:

```txt
Buồng điều phối AI
Nhóm sự cố
Hàng chờ AI cần kiểm tra
Vòng lặp cải thiện ML
```

---

## 4. Visual System Direction

### General style

Use a modern command-center aesthetic:

- dark or deep neutral surface is allowed, but not generic black + purple
- use clear status colors for priority and confidence
- use layered panels with depth
- use data cards that look operational, not decorative
- avoid equal 3-column card grids as the main visual pattern
- use asymmetric dashboard layouts where useful

### Suggested palette direction

Choose one dominant cool technical hue and one sharp operational accent.

Example token direction:

```css
--color-bg: hsl(218, 38%, 7%);
--color-surface: hsl(218, 32%, 11%);
--color-surface-elevated: hsl(218, 28%, 15%);
--color-text-primary: hsl(210, 40%, 96%);
--color-text-secondary: hsl(214, 18%, 70%);
--color-accent: hsl(174, 84%, 48%);
--color-warning: hsl(38, 92%, 58%);
--color-danger: hsl(8, 84%, 60%);
--color-success: hsl(146, 68%, 46%);
--color-border: hsla(210, 40%, 96%, 0.12);
```

This is only a direction. The final implementation must obey anti-slop-ui color rules.

### Typography

Use a distinctive heading font and a readable body font.

Do not make all screens look like a plain SaaS admin dashboard.

Preferred personality:

- compact uppercase labels for operational metadata
- strong display heading for cockpit/demo pages
- readable tabular numbers for scores and metrics

### Layout rhythm

Use different spatial rhythms by screen:

- Ticket creation: focused, guided, calmer
- Ticket detail: analysis-first with supporting metadata
- Triage Cockpit: dense operational grid
- Incident Groups: relationship-oriented cluster cards
- ML Feedback: data table + summary cards
- Demo: guided story flow

---

## 5. Motion Rules for SmartTriage

Minimum motion level: 6/10.

Required motion moments:

1. Page load stagger for major cards.
2. Hover lift for ticket/incident cards.
3. AI analysis panel reveal after ticket creation or detail load.
4. Priority score progress animation.
5. Mascot idle animation.
6. Mascot mood transition when analysis/alert/review state changes.

Do not use motion that distracts from reading support tickets.

Motion must communicate state:

```txt
thinking   -> AI is analyzing
success    -> analysis completed
alert      -> high priority / incident detected
confused   -> low confidence / human review needed
idle       -> no urgent action
```

---

## 6. Component Architecture Rules

Must follow the component-structure skill.

Recommended folder additions:

```txt
frontend/src/
├── components/
│   ├── assistant/
│   │   ├── FloatingAIGuide.tsx
│   │   ├── MascotAvatar.tsx
│   │   ├── MascotBubble.tsx
│   │   ├── MascotActionBar.tsx
│   │   └── mascotMessages.ts
│   ├── ai/
│   │   ├── AIAnalysisPanel.tsx
│   │   ├── PriorityBreakdown.tsx
│   │   ├── ConfidenceMeter.tsx
│   │   ├── DetectedSignalChips.tsx
│   │   └── SuggestedActionList.tsx
│   ├── triage/
│   │   ├── TriageCockpitShell.tsx
│   │   ├── CriticalQueue.tsx
│   │   ├── IncidentSuggestionPanel.tsx
│   │   ├── LowConfidencePanel.tsx
│   │   └── RoutingRecommendationPanel.tsx
│   ├── incidents/
│   │   ├── IncidentGroupCard.tsx
│   │   ├── IncidentTicketList.tsx
│   │   └── SimilarityScoreBadge.tsx
│   ├── feedback/
│   │   ├── MLFeedbackSummary.tsx
│   │   ├── FeedbackSampleTable.tsx
│   │   └── ExportFeedbackButton.tsx
│   ├── layout/
│   ├── ui/
│   └── navigation/
├── data/
│   ├── demoTickets.ts
│   ├── navigation.ts
│   └── mascotMessages.ts
├── hooks/
│   ├── useScrollReveal.ts
│   ├── useMascotContext.ts
│   └── useTriageState.ts
├── lib/
│   ├── api.ts
│   ├── formatters.ts
│   └── priority.ts
└── types/
    ├── ticket.ts
    ├── ai.ts
    ├── incident.ts
    └── feedback.ts
```

No page should exceed 150 lines. If it does, split into components.

---

## 7. Mascot / Floating AI Guide

### Purpose

The mascot is not decoration.

It is a small AI guide that helps users understand what SmartTriage is doing.

It should answer:

- What did AI detect?
- Why is this ticket important?
- Are there related reports?
- Does this need human review?
- What should the user do next?

### Name

Use one of:

```txt
TriageBot
SignalBot
SmartGuide
```

Default recommendation: `TriageBot`.

### Placement

Default:

```txt
fixed bottom-right
```

But avoid blocking important buttons or tables.

On mobile:

- collapse into a small circular button
- bubble opens on tap
- no large always-visible panel

### Visual forms

Preferred implementation order:

1. CSS/SVG mascot avatar first, easiest and dependency-free.
2. Lottie mascot if a local `.json` animation asset exists.
3. Rive if `.riv` asset exists and state machine is available.
4. 3D mascot only if model is optimized and does not hurt performance.

For this project, default to:

```txt
2D CSS/SVG mascot with animated states
```

Do not depend on external mascot files unless they already exist in the repo.

### Mascot states

Must support these states:

```ts
type MascotMood = 'idle' | 'thinking' | 'success' | 'alert' | 'confused'
```

State meaning:

```txt
idle       -> default guidance
thinking   -> AI analyzing ticket
success    -> AI analysis completed
alert      -> high-priority ticket or incident suggestion
confused   -> low confidence, needs human review
```

### Props contract

```ts
interface FloatingAIGuideProps {
  mood?: 'idle' | 'thinking' | 'success' | 'alert' | 'confused'
  message?: string
  actionLabel?: string
  actionHref?: string
  compact?: boolean
}
```

### Required behavior

- Idle animation: subtle floating, blink/pulse.
- Message bubble appears with staggered entrance.
- User can collapse/expand.
- Message changes based on current route/context.
- Does not cover mobile content.
- Respects `prefers-reduced-motion`.

### Example route-based messages

```ts
export const mascotRouteMessages = {
  '/student/tickets/new': {
    mood: 'idle',
    message: 'Mô tả vấn đề càng cụ thể, AI càng phân loại và ưu tiên chính xác hơn.',
  },
  '/admin/triage': {
    mood: 'alert',
    message: 'Tôi đã sắp xếp các phản ánh cần xử lý theo mức độ ưu tiên và độ chắc chắn của AI.',
  },
  '/admin/review': {
    mood: 'confused',
    message: 'Một số phản ánh có độ tin cậy thấp. Admin có thể sửa nhãn để cải thiện dữ liệu huấn luyện.',
  },
  '/admin/ml-feedback': {
    mood: 'success',
    message: 'Các nhãn đã chỉnh sửa có thể được xuất thành CSV để huấn luyện lại mô hình.',
  },
}
```

---

## 8. Screen-Specific UX Rules

### 8.1 Student Submit Ticket

Goal:

Make submitting a report feel guided, not like a boring form.

Required sections:

1. Page intro: what the student should describe.
2. Smart input area.
3. Category examples or report templates.
4. Submit button with clear loading state.
5. TriageBot guide.

Preferred UX:

- show examples of good report content
- show small helper copy: include room, system name, deadline, affected people
- after submit, route to detail page with AI analysis visible

### 8.2 Ticket Detail + AI Analysis

Goal:

Make AI output the star of the screen.

Required panels:

1. Ticket summary
2. AI Triage Analysis
3. Priority Breakdown
4. Suggested Department
5. Suggested Actions
6. Related Reports / Incident Suggestion
7. Status timeline

Avoid:

- hiding AI fields in a table
- displaying only raw JSON
- making analysis look like ordinary metadata

### 8.3 Triage Cockpit

Goal:

Help staff decide what to handle first.

Required layout:

1. Summary strip
2. Critical Queue
3. Incident Suggestions
4. Low Confidence Cases
5. Routing Recommendations
6. Recent Tickets

This page should be visually denser than the student page.

### 8.4 Incident Groups

Goal:

Show that SmartTriage can detect many reports about the same topic.

Required UI:

- incident group cards
- related ticket count
- average similarity
- priority
- department
- grouped ticket list
- similarity badges
- create/merge action if available

### 8.5 AI Review Queue

Goal:

Human-in-the-loop correction.

Required UI:

- low confidence ticket list
- top predictions
- confidence display
- category correction control
- correction note
- save correction button

### 8.6 ML Feedback Loop

Goal:

Show how corrected labels improve the ML system.

Required UI:

- corrected samples count
- low confidence count
- ready for retraining status
- feedback sample table
- export CSV button
- short explanation of retraining loop

### 8.7 Demo Flow

Goal:

Allow a judge or viewer to understand the whole product in 3-5 minutes.

Required UI:

- demo steps
- sample ticket content
- copy buttons
- links to main pages
- expected AI result per case

---

## 9. Content Rules

Use realistic SmartTriage-specific content.

Good content examples:

```txt
Không đăng nhập được hệ thống thi online, sáng mai em có lịch thi.
Wifi phòng B305 rất yếu, lớp em không thể học trực tuyến ổn định.
Máy chiếu phòng A302 không nhận HDMI.
Em cần xác nhận tình trạng thanh toán học phí.
```

Avoid:

```txt
Lorem ipsum
Example ticket
Test data
Untitled
```

Text should make demo value obvious.

---

## 10. Data and Type Rules

All UI must use TypeScript interfaces.

Recommended types:

```ts
export type PriorityLevel = 'low' | 'medium' | 'high'
export type ReviewStatus = 'auto_accepted' | 'needs_review' | 'uncertain' | 'corrected'
export type MascotMood = 'idle' | 'thinking' | 'success' | 'alert' | 'confused'
```

AI analysis type must include:

```ts
interface TicketAnalysis {
  category: string
  categoryLabel: string
  categoryConfidence: number
  priority: PriorityLevel
  priorityScore: number
  suggestedDepartment: string
  suggestedActions: string[]
  detectedSignals: string[]
  explanation?: {
    summary: string
    categoryReason: string
    priorityReason: string
    departmentReason: string
  }
  priorityBreakdown?: PriorityBreakdownItem[]
  reviewStatus?: ReviewStatus
}
```

---

## 11. Accessibility Rules

- Mascot must have accessible label.
- Collapsed mascot button must be keyboard accessible.
- Buttons require visible focus states.
- Priority colors must not be the only indicator; include text labels.
- Progress bars require `aria-label` or text alternative.
- Tables must have headers.
- Motion must respect `prefers-reduced-motion`.

---

## 12. Performance Rules

- Avoid heavy animation libraries unless necessary.
- Avoid Three.js/3D mascot unless explicitly requested.
- Keep mascot CSS/SVG lightweight.
- Do not load large assets on every route if not needed.
- Use dynamic import for optional heavy components.
- Avoid client components for static UI unless interactivity is required.

---

## 13. Redesign Acceptance Criteria

A frontend redesign is accepted only if:

- The app no longer feels like plain CRUD.
- AI analysis is visible and understandable.
- Priority reasoning is clear.
- Related reports / incident grouping is visible.
- Admin triage workflow is obvious.
- Mascot gives contextual guidance.
- Navigation names communicate product value.
- Components are decomposed and maintainable.
- Build passes.
- Main demo flow works end-to-end.

---

## 14. Banned Outcomes

Do not produce:

- one huge page file
- dashboard made only of generic metric cards
- empty mascot that only waves and says hello
- AI output hidden in JSON or tiny metadata
- random purple gradient dark SaaS UI
- background grid pattern
- table-only admin screens
- hardcoded mock data mixed inside components
- unclickable decorative controls
- visual effects that make ticket text hard to read

---

## 15. Preferred Final Product Description

When the redesign is done, the UI should support this statement:

> SmartTriage is an AI-assisted triage cockpit that helps school staff understand, prioritize, group, and resolve student reports faster. Its floating TriageBot explains what the AI detected and guides users through the next action.
