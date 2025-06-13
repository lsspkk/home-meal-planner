# AI Assistant Code Change Instructions

## 1. Make the Requested Code Change
- Apply the user's requested change(s) to the codebase.

## 2. Fix Linter and TypeScript Errors
- Run `npm run lint` and/or `npm run build` after each change.
- Fix all reported linter and TypeScript errors/warnings, unless the user specifies otherwise.

## 3. Test the Change
- After fixing errors, always run `npm run build` to ensure the project builds successfully.
- If there are automated tests (e.g., `npm test`), run them as well.

## 4. Commit and Push
- If the build and lint pass, commit the changes with a descriptive message.
- Push to the appropriate branch.

## 5. Report Status
- Inform the user of the outcome (success, errors, or further action needed).

## 6. If Errors Remain
- If errors persist after reasonable attempts, report them to the user and ask for guidance. 

## 7. Use Heroicons in Buttons
- When implementing or updating buttons, use a suitable Heroicon (from @heroicons/react) instead of text where appropriate (e.g., for actions like add, remove, view, edit, close, etc.).
- Only use text if no suitable icon exists or if clarity would be lost by using an icon alone. 