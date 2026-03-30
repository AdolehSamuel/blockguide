# BlockGuide

BlockGuide is an interactive, chat-based platform that guides African youth through personalized blockchain learning paths. By answering a few simple questions, users are matched with a tailored learning roadmap to kickstart their blockchain journey.

**Live Demo:** [https://blockguide-iota.vercel.app/](https://blockguide-iota.vercel.app/)

## Setup Instructions

Follow these exact steps to get the project running locally.

### Prerequisites

- Node.js (v18 or newer recommended)
- npm (Node Package Manager)
- A PostgreSQL database (local or hosted, e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or a local install)
- A Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/AdolehSamuel/blockguide.git
cd blockguide
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup the Database and Environment

This project uses **PostgreSQL** with Prisma ORM and the Google Gemini API.

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="your-development-secret-key-123"
GEMINI_API_KEY="your-google-gemini-api-key-here"
```

Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your PostgreSQL credentials. If you are using a hosted provider like Neon or Supabase, they will give you this connection string directly.

Then push the schema to your database:

```bash
npx prisma db push
```

### 4. Run the Application

```bash
npm run dev
```

### 5. Open in your Browser

Navigate to `http://localhost:3000` in your web browser.

- Sign up as a new **Learner** to explore the chat and roadmaps.
- To access the **Admin Dashboard** (`/admin`), you need an account with the `ADMIN` role. After signing up, run `npx prisma studio` and change your user's `role` field from `"LEARNER"` to `"ADMIN"`.

## Project Structure

- **Frontend & Backend:** Next.js App Router
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **AI:** Google Gemini API
- **Styling:** TailwindCSS

## System Requirements Specification (SRS)
[Link to your Google Doc SRS here]
