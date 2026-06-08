# SmartTriage Frontend Redesign Audit

## Current routes

| Route | File | Purpose |
|---|---|---|
| `/` | `frontend/src/app/page.tsx` | Redirect theo trạng thái đăng nhập và role. |
| `/login` | `frontend/src/app/login/page.tsx` | Đăng nhập người dùng demo/thật. |
| `/tickets` | `frontend/src/app/tickets/page.tsx` | Danh sách phản ánh cho sinh viên và staff/admin. |
| `/tickets/new` | `frontend/src/app/tickets/new/page.tsx` | Tạo phản ánh mới và gọi backend để AI phân tích. |
| `/tickets/[id]` | `frontend/src/app/tickets/[id]/page.tsx` | Chi tiết phản ánh, trạng thái và kết quả AI. |
| `/dashboard` | `frontend/src/app/dashboard/page.tsx` | Tổng quan số liệu, polling ticket mới. |
| `/admin/tickets` | `frontend/src/app/admin/tickets/page.tsx` | Quản trị queue ticket, lọc, sort và cập nhật status. |
| `/admin/model-info` | `frontend/src/app/admin/model-info/page.tsx` | Minh bạch thông tin model AI. |

Các route được prompt redesign yêu cầu nhưng chưa có ở branch hiện tại: `/admin/triage`, `/admin/incidents`, `/admin/incidents/[id]`, `/admin/review`, `/admin/ml-feedback`, `/demo`.

## Current components

Shared layout:

- `frontend/src/components/layout/AppShell.tsx`
- `frontend/src/components/layout/Sidebar.tsx`
- `frontend/src/components/layout/Topbar.tsx`

UI primitives hiện có:

- `Badge`
- `Button`
- `Card`
- `EmptyState`
- `Input`
- `Loading`
- `Textarea`
- `Toast`

Ticket components:

- `TicketList`
- `TicketCard`
- `TicketFilters`
- `TicketAnalysisPanel`
- `TicketStatusForm`
- `DuplicateCandidates`
- `SuggestedActions`

## Current API integration

Core client and auth:

- `frontend/src/lib/api.ts`
- `frontend/src/lib/auth.ts`
- `frontend/src/lib/utils.ts`

Feature API files:

- `frontend/src/features/auth/api.ts`
- `frontend/src/features/tickets/api.ts`
- `frontend/src/features/dashboard/api.ts`
- `frontend/src/features/ai/api.ts`

Types:

- `frontend/src/types/auth.ts`
- `frontend/src/types/ticket.ts`
- `frontend/src/types/dashboard.ts`
- `frontend/src/types/ai.ts`

Frontend currently calls backend only. It does not call `ai-service` directly, which matches the service boundary.

## Current styling system

- Next.js App Router with TypeScript.
- Tailwind CSS classes in components.
- `frontend/src/app/globals.css` contains base reset/body styles only.
- `frontend/tailwind.config.ts` extends a small color set: `ink`, `panel`, `line`, `brand`, `signal`.
- No dedicated token file exists yet.
- No component library is installed beyond `lucide-react` icons.
- Some Vietnamese UI strings are currently mojibake and should be repaired during page-level redesign.

## Pages with weak UX

- `/tickets/new`: functions correctly but is a plain form. It does not guide students to write useful reports for ML classification.
- `/tickets/[id]`: shows AI metadata but AI analysis is not yet the dominant visual story.
- `/dashboard`: useful metrics, but still resembles a generic dashboard. It should become a triage cockpit that answers what staff should handle first.
- `/admin/tickets`: table-heavy CRUD queue. It needs stronger priority, routing, confidence, and review cues.
- `/admin/model-info`: has good technical value but needs stronger model transparency presentation.
- Current sidebar labels are generic and do not clearly separate student and staff/admin triage workflows.

## Main redesign risks

- Changing color tokens too aggressively can break legacy light cards while page-level redesign is still incomplete.
- Adding links for future routes can create 404s if navigation is not marked as prepared/disabled.
- Mojibake strings may hide real UX quality problems until files are rewritten in UTF-8.
- Dashboard and admin ticket pages are currently large client components; future redesign should extract feature components to keep files under 150 lines.
- Existing API responses differ by feature maturity, so new UI should show graceful empty/fallback states.

## Recommended redesign order

1. Establish design tokens, global motion, layout shell, role-aware navigation, and reusable UI primitives.
2. Redesign ticket creation and ticket detail so the AI analysis value is visible to students first.
3. Build the admin triage cockpit as the primary operational command center.
4. Add incident grouping, AI review queue, and ML feedback screens.
5. Add contextual TriageBot mascot after the main route structure is stable.
6. Add demo flow and responsive/accessibility polish.
7. Run final integration to verify navigation, mascot, ticket flow, and build.
