# EduConnect - Teacher Section

## Current State
EduConnect (GCG Smart Student Hub) is a college portal with Dashboard, Subjects, Calendar, Chat, Profile, Contact, and About pages. Uses glassmorphism UI with navy-to-cyan gradients, Internet Identity auth, and ICP backend.

## Requested Changes (Diff)

### Add
- New `/teachers` route: Teacher List Screen with search, subject filter, teacher cards (avatar, name, subject, rating, View Profile button)
- New `/teachers/:id` route: Teacher Profile Screen with gradient header, avatar, contact details, intro video placeholder, Notes section, Chat UI tab, Performance tab, Notifications tab
- Real teacher data for all 34 teachers with auto-generated details (email, phone, experience, role, rating)
- Dark mode support throughout

### Modify
- Add "Teachers" link to sidebar navigation

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/data/teachers.ts` with all 34 teachers + auto-generated fields
2. Create `src/frontend/src/pages/Teachers.tsx` - list screen with search/filter
3. Create `src/frontend/src/pages/TeacherProfile.tsx` - profile screen with 4 tabs: Details, Notes, Chat, Performance+Notifications
4. Add Teachers route to App.tsx router
5. Add Teachers nav item to sidebar
