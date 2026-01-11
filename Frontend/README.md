# Financst Client

The Financst client is a modern single-page application that lets investors track their portfolios, monitor watchlists, and explore stock details through an intuitive UI powered by Vite and React.

## Tech Stack

- **React 19** with **Vite** for lightning-fast development
- **React Router 7** for client-side navigation
- **Axios** for REST API communication
- **Zustand** for lightweight global state
- **Tailwind CSS 4** for utility-first styling
- **Recharts** and **react-icons** for data visualization and iconography

## Installation

Use the following commands to install dependencies for the client only:

```bash
cd client
npm install
```

## Running the App

Start the Vite development server with:

```bash
npm start
```

This runs the alias defined in `package.json` (equivalent to `npm run dev`) and serves the app at `http://localhost:5173` by default.

## Environment Variables

No environment variables are required for the client.

## MVP Scope

The MVP currently covers the authentication flow (sign up, log in, forgot password), the user dashboard with portfolio KPIs and watchlist widgets, and the stock detail page that surfaces charts and key metrics. Content-first screens such as About, Contact, Terms of Service, and Privacy Policy still use placeholder/static copy, and deeper portfolio management tools (editing holdings, advanced analytics) will arrive once the backend endpoints stabilize.

## Directory Structure

- `public/`: Static assets.
- `src/`
  - `api/`: API integrations.
  - `components/`: Reusable UI components.
  - `pages/`: Route-level views (Auth, User Home, Stock Detail, etc.).
  - `assets/`: Images and shared styles.
  - `App.jsx`: Route definitions and layout shell.
  - `main.jsx`: Entry point that mounts the React app.

## Available Scripts

- `npm start`: Alias to `vite`, starts the dev server.
- `npm run dev`: Starts the dev server (identical to `npm start`).
- `npm run build`: Builds the app for production.
- `npm run preview`: Serves the production build locally.
- `npm run lint`: Runs ESLint against the project.
