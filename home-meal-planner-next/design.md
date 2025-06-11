# Design and Functionality Documentation

This document describes the intended functionality and design of each main page in the Home Meal Planner app.

---

## Authentication System

The application supports two user modes: **Visitor Mode** (local-only) and **Authenticated User Mode** (with backend synchronization).

### Login Modal

- A login modal is available on the front page, it will be shown when page is first loaded
- The modal contains username and password fields with HTTP Basic Authentication
- Upon successful login, the user's session is established and their data is loaded from the backend
- Failed login attempts show appropriate error messages
- There is info and a button that let's user continue using the app as a visitor
  that describes shortly that all saving is done into the local device

### User Modes

#### Visitor Mode (Default)

- Users can use the application without authentication
- All recipes and weekly menus are stored in browser's localStorage
- Data persists locally between sessions but is device-specific
- No synchronization across devices
- Full functionality available without backend dependency

#### Authenticated User Mode

- Users authenticate using HTTP Basic Authentication against the backend API
- All recipes and weekly menus are synchronized with the backend server
- Data is accessible across devices and browsers
- Backend API endpoints (as defined in openapi.yaml) handle data persistence:
  - `GET/POST /recipes` - Recipe management
  - `GET/POST /weekmenus` - Weekly menu planning
  - `GET /user` - User information
  - `POST /user/{id}/resetpassword` - Password management

### Data Migration Strategy

When a visitor logs in for the first time:

- Local localStorage data (recipes and weekly menus) should be offered for upload to the backend
- User can choose to merge local data with backend data or replace one with the other
- Clear indication of what data will be preserved/overwritten

### Settings Integration

The settings page includes a new **User Account** section at the top:

#### For Visitors:

- **Login Button**: Opens the login modal to authenticate with the backend
- **Account Status**: Shows "Using offline mode - data stored locally"
- **Data Migration Info**: Information about what happens when logging in

#### For Authenticated Users:

- **Account Status**: Shows username and "Logged in" status
- **Logout Button**: Logs out and optionally keeps/clears local data
- **Change Password Button**: Opens modal with current password, new password, and confirm password fields
- **Data Sync Status**: Shows last sync time with backend

### Application Context Updates

The existing `AppStateContext` will be extended to include:

- `userMode`: 'visitor' | 'authenticated'
- `userInfo`: User object (uuid) when authenticated, null when visitor
- `isLoading`: Boolean for authentication state loading
- `lastSyncTime`: Timestamp of last backend synchronization (for authenticated users)

### Data Persistence Strategy

#### Visitor Mode:

- `recipes`: Stored in `localStorage.recipes`
- `weeklyMenus`: Stored in `localStorage.weeklyMenus`
- Immediate persistence on any changes

#### Authenticated Mode:

- Local caching in localStorage for offline capability
- Periodic synchronization with backend API
- Optimistic updates with conflict resolution
- Background sync when connection is restored

### Error Handling

- Network errors gracefully degrade to local storage for authenticated users
- Clear user feedback for authentication failures
- Session expiration handling with re-authentication prompts
- Data conflict resolution when local and backend data differ

---

## Home Page (`/`)

The Home page has two main chapters/views, depending on the selected view mode:

### 1. Weekly View

- The top section shows the current week ("Viikko N"), with a list of recipes selected for the meals of the current week.
- There is an edit icon that toggles the layout, allowing selected recipes to be unselected from the week and new recipes to be added.
- In the add-new-recipes section, there is an "Arvo"-button that adds a random recipe to the selected list.
- Only new recipes are visible in the add list, and only new recipes can be added with the "Arvo"-button.
- When the week's selection is changed, the changes are instantly saved into local storage.
- At the bottom, there is a week navigator to choose the next/previous week and to switch to month view.

### 2. Monthly View

- The top of the page shows the title of the month in Finnish (e.g. "Heinäkuu 2024").
- Below the title, show a list of all weeks that have at least one weekday belonging to the current month.
- Each week is shown as a separate section, with its own list of selected recipes and the ability to edit them as in the weekly view.
- The week/month navigation bar is visible at the bottom.

---

## About Page (`/about`)

Tietosivu, joka kertoo sovelluksesta lyhyesti. Sivulle pääsee navbarin info-painikkeesta.

---

## Market Page (`/market`)

The market page is opened from a shopping cart icon in the weekly list.
It shows a table like list of the ingredients sorted cleverly.
in 2nd column is 8 first characters of the recipe name.

---

## Settings Page (`/settings`)

Settings page has buttons to import/export the data: all recipes and the menus planned for each week.

Another button exists for managing the recipes.

THere's also controls for the user interface setup.
THe home page can be chosen to contain whole month, or one week only.
This affects the week/mont/navigation bar on the home page, and how many weeks are visible.

---

## Import-Export Page (`/settings/import-export`)

Here's three actions and buttons. After each action, there's a section below that shows results of the action

Vie - To Export i.e. save the recipes and weekly menus. This saves all into file called kodin-ruokalista.json and shows statistics about saved stuff.

Lue - To read kodin-ruokalista.json file and show statistics about it compared to the current week and recipe data that is saved in local storage

Tuo - To read kodin-ruokalista.json file and to add all recipes into recipe database and also to add those recipes to the weeks that currently do not have that recipe.

## Manage Page (`/settings/manage`)

Here's functionality that let's users edit old recipe ingredients, titles and links of existing recipes.

There's also add recipe button. It opens a modal that has inputs for title, and link list, and ingredient list. On the ingredient list if user clicks enter or tab, next ingredient is selected.

---

## Application State Management Plan (React Context)

To keep the application state (such as the currently selected week) consistent between pages and minimize unnecessary rerenders, the following plan will be implemented:

- **React Context for App State:**

  - Create a React context (e.g. `AppStateContext`) to hold global state such as the current week index (selected week), and any other shared state (e.g. selected month, view mode, etc.).
  - The context provider will be placed at the top level of the app (e.g. in `layout.tsx` or a custom provider component).

- **Current Week Index:**

  - The context will include a `currentWeekIdx` (or `selectedWeekIdx`) value.
  - The initial value will be calculated using the `getWeekNumber` utility from `utils.ts`, based on the current date.
  - Example: `const initialWeek = getWeekNumber(new Date());`

- **Usage in Pages:**

  - All pages/components that need to read or update the current week will use the context (via a custom hook, e.g. `useAppState`).
  - The `/market` page and the main home page will both use this context for the selected week.

- **Updating Week Number:**

  - The `DateNavigation` component will update the week number in the context state when the user navigates weeks/months.
  - This ensures all parts of the app see the same selected week.

- **Minimal Rerender Strategy:**

  - The context will be split or memoized as needed to avoid rerendering the entire app when only the week number changes.
  - For example, use `React.memo` or context selectors to only rerender components that depend on the week number.

- **Persistence:**
  - Optionally, the selected week can be persisted to localStorage and restored on reload for a seamless user experience.

---
