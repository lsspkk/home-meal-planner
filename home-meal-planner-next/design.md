# Design and Functionality Documentation

This document describes the intended functionality and design of each main page in the Home Meal Planner app.

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

Here's three actions and buttons. After each action, there's a status section below that shows results of the action. In the end there is an action area that changes according to the clicked button:

Vie - To Export i.e. save the recipes and weekly menus. Status section shows statistics: how many weeks, how many menus in them. How many recipes, how many ingredients in them. Action area shows scrollable preformatted prettyprinted json, and has a Kopioi leikepöydälle button on the end of it.


Tuo - This shows first in the action area an empty textarea input that has a placeholder. Liitä json-muotoinen data tähän. And when data is pasted there, it is read and the status area shows statistics of weeks, their menus, recipes and their ingredients. It also shows how many recipes already exist and if they have same ingredients. And it also shows if there are weeks that already have the same foods. 

Status area also shows if there is some error in the json structure so, that it does not have the weekly menus and recipe collection fields in right format, it may include row and colnumber and wrong text field and other short information.

There's disabled Suorita button at the end of action area. Button is not disabled only then, when the data area has new or edited recipes or new or different weekly menus.

The import will add new recipes, and replace existing recipes, if they have different ingredients. For weekly menus, the import will add new foods to those weeks that already exist but do not have the food that is in json data. And the import will add those weeks that are in json data but not in current state.

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

## Authentication (Login and Change Password)

- **Login Modal (Global):**
  - If any page loads and the application context (or "visitor" user) has no username/password and uuid, a login modal is shown.
  - The login modal calls the backend endpoint (/user) using HTTP Basic Authentication (via the "Authorization" header) to verify the credentials and retrieve the user's uuid.
  - The username is saved in localStorage, while the password is stored only in the application context (i.e. in memory).
  - On page reload (or if the context is reset), the login modal is re-displayed with the username field filled (from localStorage) and the password field autofocused.

- **Change Password (Settings Page):**
  - On the Settings page, if the user is authenticated (i.e. logged in), a "Vaihda salasana" button is shown.
  - Clicking this button opens a modal (or a form) that prompts the user for the old and new passwords.
  - The modal (or form) sends a request (using the endpoint /user/{id}/resetpassword) to the backend to update the user's password.

---