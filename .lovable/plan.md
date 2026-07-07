# CMS + Admin Management for ANALOG IAS ACADEMY

## 1. Remove Gallery
- Delete the Gallery page and remove it from the top navigation, footer quick links, and the sitemap.

## 2. Roles: Admin + Editor
- Add an **Editor** role alongside **Admin**.
  - **Admin**: manage all content *and* manage team members/roles.
  - **Editor**: manage all content (pages, courses, results) but **cannot** manage users.
- Content editing is allowed for admins and editors; user management is admin-only.

## 3. CMS Page Editor (structured fields)
A new "Pages" area in the admin dashboard lets staff edit fixed fields per section without code:
- **Home**: hero eyebrow/headline/subheading, the 4 stat values+labels, the "Why choose us" heading, and the CTA text.
- **About**: hero heading + intro, story paragraphs, and the values checklist.
- **Results**: page hero heading + intro text.
- **Courses**: page hero heading + intro text.
- **Contact**: address, phone, email, office hours, and map embed URL.

Content is stored per page and read by the public pages, so edits appear live on the site. Current copy is preserved as the starting content.

## 4. Course & Result Cards (add / edit / reorder / images)
- **Courses**: add, edit, delete, and drag-to-reorder course cards — each with title, description, and an image (upload or paste a URL). Published cards appear on the Home preview and Courses page.
- **Results**: same management for success cards — student name, rank (e.g. "AIR 12"), year, and photo.
- Images upload to a media library in the backend; a public URL is also accepted.

## 5. User Management (admin only)
A "Team" screen where an admin can:
- See all team members with their roles.
- **Invite** a new member by email and assign Admin or Editor. An invite email with a secure signup link is sent; the invited person sets their password on a new set-password page.
- Change a member's role or remove their access.
- Safeguards: an admin cannot remove their own admin role or the last remaining admin.

## 6. Admin dashboard layout
The existing `/admin` becomes a tabbed workspace: **Pages · Courses · Results · Submissions · Team** (Team hidden for editors).

---

## Technical details
- **DB migrations**: add `editor` to the role enum; create `page_content` (page key + JSON fields), `courses`, and `results` tables with GRANTs + RLS (public read of published rows via `anon`; write for staff via a private `is_staff` helper). Seed with current site copy. Add a public `media` storage bucket with staff-only write policies. Reuse the existing private `has_role` pattern.
- **Public reads**: new public server functions (publishable key, anon policies) called from route loaders; pages render from DB with safe fallbacks.
- **Staff server functions** (`cms.functions.ts`): page content upsert; course/result CRUD + reorder — gated by `is_staff`.
- **Admin server functions** (`users.functions.ts`): list users (Auth Admin API + roles), invite (`inviteUserByEmail` + role grant), set/remove role — gated by admin role; last-admin protection.
- **New routes**: `/set-password` (public) for invited users; role helpers extend `getMyAdminStatus` to return `{ isAdmin, isEditor }`.
- **Email note**: invites use the built-in auth email sender. For reliable, branded delivery I can set up a verified email domain in a follow-up — invite links also work via the standard flow meanwhile.

Once you approve, I'll implement the migrations first, then wire the public site and admin UI.