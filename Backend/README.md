# Financst

## 1. Project Description

This backend is the core API for the **Financst** application, a financial dashboard that provides stock market data, news, and user portfolio management. It is built using **Node.js**, **Express.js**, **MongoDB** (for user data), and **DuckDB** (for high-performance financial data querying).

The MVP implements the **User** entity as the primary managed resource, supporting full account lifecycle management. Additionally, it includes comprehensive read-only endpoints for **Stocks** data and **Authentication** flows.

## 2. Installation Instructions

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

## 3. Run Instructions

To start the server in development mode (with nodemon):

```bash
npm run dev
```

To start the server in production mode:

```bash
npm start
```

## 4. API Examples

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Register a new user with email/password. |
| **POST** | `/api/auth/login` | Authenticate existing user. |
| **POST** | `/api/auth/google-login` | Authenticate/Register via Google OAuth. |
| **POST** | `/api/auth/forgot-password` | Send password reset email. |
| **POST** | `/api/auth/reset-password/:token` | Reset password using token. |

### User Entity (`/api/user`)

*This is the main entity for the MVP scope.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/user/:id` | **READ**: Get user profile details. |
| **PUT** | `/api/user/:id` | **UPDATE**: Update profile (name, bio, photo). |
| **DELETE** | `/api/user/:id` | **DELETE**: Permanently delete user account. |
| **POST** | `/api/user/:id/watchlist` | Add a stock symbol to user's watchlist. |
| **DELETE** | `/api/user/:id/watchlist` | Remove a stock symbol from user's watchlist. |

### Stocks Data (`/api/stocks`)

*Financial data served via DuckDB.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/stocks/dashboard/gainers` | Top 5 gaining stocks. |
| **GET** | `/api/stocks/dashboard/losers` | Top 5 losing stocks. |
| **GET** | `/api/stocks/dashboard/active` | Top 5 most active stocks. |
| **GET** | `/api/stocks/dashboard/sectors` | Sector performance metrics. |
| **GET** | `/api/stocks/dashboard/earnings` | Upcoming earnings calendar. |
| **GET** | `/api/stocks/news/market` | General market news. |
| **GET** | `/api/stocks/list` | List of all stocks (for search). |
| **GET** | `/api/stocks/:symbol/profile` | Company profile & key stats. |
| **GET** | `/api/stocks/:symbol/financials` | Income statement summary. |
| **GET** | `/api/stocks/:symbol/news` | Specific news for a stock. |
| **GET** | `/api/stocks/:symbol/history/:days` | Historical price data (OHLCV). |

### Contact (`/api/contact`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/contact` | Send a contact form email. |

## 5. Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email_for_sending_mails
EMAIL_PASS=your_email_password
```

## 6. Scope Explanation

### Main Entity Implemented

**The User Entity** is the fully responding entity for this MVP.

- **Model**: Defined in `models/UserModel.js` with fields for name, surname, email, password, authProvider (local/google), profilePicture, and watchList.
- **CRUD**:
  - **Create**: Via `/api/auth/signup`.
  - **Read**: Via `/api/user/:id`.
  - **Update**: Via `/api/user/:id`.
  - **Delete**: Via `/api/user/:id`.

### Status of Requirements

- **Functional**: Full Authentication flow, User Profile management, Watchlist management, and extensive Read-only Stock Data APIs.
- **Pending/Future**:
  - **Statistics Endpoints**: `/api/statistics` (Not required for MVP).
  - **Admin Login**: Currently all users are standard users.
  - **Complex Relationships**: Advanced aggregations between users and complex financial models are reserved for future phases.
