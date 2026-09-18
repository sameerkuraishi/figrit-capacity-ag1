# Capacity Connect interface language

The application interface is English-only. The former translation provider,
DOM text observer, dictionaries, and language selector have been removed.

`app/layout.tsx` renders English and left-to-right attributes before hydration.
`components/shared/EnglishOnly.tsx` resets the legacy
`capacity-connect-language` browser preference to `en` when the app loads.
Blocked browser storage does not stop rendering or navigation.

Write new interface strings in English. Course/expert language metadata and
existing user records are content, not interface preferences; they are preserved.
The signup payload retains the existing `preferred_language` field with the
fixed value `English` for compatibility with the current API.
