# BlockGuide

BlockGuide is an interactive, chat-based platform that guides African youth through personalized blockchain learning paths. By answering a few simple questions, users are matched with a tailored learning roadmap to kickstart their blockchain journey.

## Setup Instructions

Follow these exact steps to get the project running locally.

### Prerequisites

- Node.js (v18 or newer recommended)
- npm (Node Package Manager)

### 1. Clone the Repository

Clone this public repository to your local machine:

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd blockguide
```

### 2. Install Dependencies

Install all the required packages:

```bash
npm install
```

### 3. Setup the Database and Environment

This project uses Prisma and SQLite for a simple, out-of-the-box local setup, along with the Google Gemini API.

Create a `.env` file in the root directory if it does not exist, and ensure it contains:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-development-secret-key-123"
GEMINI_API_KEY="your-google-api-key-here"
```

Then, initialize and migrate your database:

```bash
npx prisma db push
```

### 4. Run the Application

Start the Next.js development server:

```bash
npm run dev
```

### 5. Open in your Browser

Navigate to `http://localhost:3000` in your web browser.

- You can sign up as a new Learner.
- To access the Admin Dashboard (`/admin`), you will need an account with the `ADMIN` role. For local testing, you can manually use Prisma Studio (`npx prisma studio`) to change a registered user's role from `"LEARNER"` to `"ADMIN"`.

## Project Structure

- **Frontend & Backend:** Next.js App Router
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** TailwindCSS

## System Requirements Specification (SRS)
[Link to your Google Doc SRS here]
