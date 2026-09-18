# FIGR.IT / Capacity Connect - Stage 1 frontend handoff

## Scope delivered

English-only shared interface and landing-page improvements. Backend code,
database files, server/hosting configuration, dependency manifests, and lockfile
are unchanged. No later-stage admin, trainer, trainee, or chatbot features were
implemented. Nothing was deployed.

## Frontend changes

- Replaced the translation provider and DOM text mutation observer with a small
  English-only initialiser. Server HTML uses `lang="en"` and `dir="ltr"`; body
  direction is also fixed. The old `capacity-connect-language` local preference
  is reset to `en`. Blocked local storage is caught without stopping the app.
- Removed selectors from the landing page, workspace top bar, and signup form.
  Signup retains `preferred_language: "English"` in its existing request shape.
  Stored profiles and course/expert language metadata are not rewritten.
- Refreshed all three landing-page role cards with local SVG illustrations,
  clearer descriptions, feature lists, and explicit workspace entry buttons.
  The existing Winter Chill palette, page section order, logo, and role flow
  remain. The illustrations have no external image dependency.
- Fixed the Platform anchor, added a keyboard skip link, and exposed landing
  navigation on smaller screens. Added responsive card layouts and reduced-motion
  handling. Associated shared form labels with their fields, labelled icon-only
  navigation controls, and removed hidden mobile navigation from the tab order.
- Labelled the static landing metrics as demo data and moved them to the typed
  `lib/landing-demo.ts` presentation-data module. A future data source can pass a
  `LandingSnapshot` to the landing component.
- Added a persistent demo-workspace notice whenever there is no API token.
  Existing sign-in fallback remains a sample preview, not authenticated access.
  Account-service text no longer assumes a particular backend framework.
- Fixed two pre-existing TypeScript errors in the frontend API response helper
  by narrowing unknown error data. URLs, methods, headers and successful-response
  handling are preserved. The generic successful response cast is not runtime
  schema validation.
- Moved existing auth role/mode updates into their click handlers and keyed the
  workspace by role, resolving lint findings in the shared component.

## Run on your computer

Use Node.js 22.13 or later, as required by the existing package.json.
Extract this archive into a new folder and open that folder in VS Code.
From the folder containing package.json, run:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite. A connected backend is required for real
sign-in and registration. If sign-in fails, the existing demo fallback opens
sample data and clearly labels the workspace as a demo. Do not treat that
fallback as production authentication.

```powershell
npm.cmd run build
npx.cmd tsc --noEmit --incremental false
```

If copying individual files over an existing checkout instead of extracting this
archive, also delete these retired files:
- components/i18n/LanguageProvider.tsx
- components/i18n/LanguageSwitcher.tsx

## Backend handoff

No new endpoint is required for Stage 1. The landing content is presentation data;
selecting a role sets the frontend login choice and grants no permissions.

### Existing frontend contract retained

The current frontend API adapter still uses NEXT_PUBLIC_API_BASE_URL, with its
existing development fallback http://127.0.0.1:8000/api. No server settings were
changed. The backend owner can support this contract with their chosen framework
or agree a new adapter contract later.

Login: POST /auth/login/

```json
{"email":"trainee@example.org","password":"<user-entered password>"}
```

Expected successful response shape (illustrative account):

```json
{
  "token":"<token from backend>",
  "user":{
    "id":1,
    "name":"Demo Trainee",
    "email":"trainee@example.org",
    "role":"trainee",
    "employeeId":"DEMO-001",
    "department":"Digital Outreach",
    "designation":"Associate",
    "qualification":"Graduate",
    "experienceYears":1,
    "interests":[],
    "skills":[],
    "certificates":[],
    "approved":true,
    "organization":"Example Organisation",
    "domain":"Marketing",
    "preferredLanguage":"English"
  }
}
```

Registration: POST /auth/register/

```json
{
  "name":"Demo Trainee",
  "email":"trainee@example.org",
  "password":"<user-entered password>",
  "role":"trainee",
  "organization":"Example Organisation",
  "department":"Digital Outreach",
  "designation":"Associate",
  "qualification":"Graduate",
  "experience_years":1,
  "domain":"Marketing",
  "preferred_language":"English"
}
```

The existing frontend expects `{registered, pendingApproval?, token?, user}`.
A trainer pending approval receives `pendingApproval: true`; a completed trainee
signup uses the returned token and user. Error responses use an appropriate HTTP
status and `{"error":"English error message"}`. The frontend displays server
error text as supplied; the backend owner must provide English messages for the
English-only deployment.

The backend remains responsible for authentication, validation, permissions,
organisation access and persistence. Frontend role selection is not an access
control. No new backend logic is supplied in this stage.

### Optional future proposal - NOT implemented or called

If the team later wants a real landing snapshot, a proposed action is
GET /landing/snapshot/, returning the `LandingSnapshot` shape from
`lib/landing-demo.ts`. Example partial shape:

```json
{
  "readiness":76,
  "improvement":8,
  "metrics":[{"id":"competencies","label":"Verified competencies","value":"3824"}],
  "competencies":[
    {"name":"Marketing Analytics","current":54,"required":80,"status":"critical"}
  ],
  "gap":{"unit":"Digital Outreach","name":"Analytics gap detected","points":26},
  "expert":{"name":"Demo Expert","specialty":"Marketing Analytics","fit":96}
}
```

All values above are examples. Agree the metric definitions and public-data
policy before using live organisation data on a public landing page. The metric IDs are stable: `competencies`, `experts`, `gaps`, and `cohorts`.
Summary metrics are selected by ID rather than array position. This optional API is not
needed to use the Stage 1 frontend.

## Checks completed

- Production build: PASS (`npm run build`).
- TypeScript: PASS (`tsc --noEmit --incremental false`).
- ESLint on all changed TypeScript/TSX files: PASS.
- Existing rendered HTML and UI component tests: 5 passed, 0 failed.
- Rendered landing HTML checks: English/LTR attributes, all four navigation
  anchor targets, three role entries, demo labels, and no language selector passed.
- Archive comparison: backend, database, server configuration and dependency
  files byte-identical to the supplied ZIP.
- No live backend or LLM integration was tested or changed.
- Browser visual and interactive checks could not complete: this environment's
  browser blocked the local preview. The standalone browser download was also
  unavailable. Responsive rules and accessible markup are implemented, but real
  browser validation must still be done on the developer's machine.

## Short browser review checklist

1. At 320px, 390px, 768px and desktop widths, check navigation, hero text, and
   the three role cards for overflow or clipping.
2. In browser developer tools set localStorage['capacity-connect-language'] to
   'ur', then reload. Verify English text, left-to-right layout, and stored 'en'.
   Repeat with 'hi' and with storage disabled.
3. Use Tab and Enter to reach the skip link, navigation anchors, and role CTAs.
   Verify each CTA selects its corresponding login role and scrolls to the form.
4. Verify there is no language dropdown on landing, registration or workspaces.
5. Check shared form labels, registration failure messages, and the visible demo
   banner when sign-in is unavailable. Do not use real credentials for demo QA.
6. With the teammate's API connected, verify real login, registration and error
   states. The full backend-dependent role features belong to later stages.

## Pending content clarification

The first-page item to remove was not identified clearly. It has not been
removed. Provide its exact visible text or a screenshot before that edit.
