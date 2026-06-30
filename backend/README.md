# TrendAi Backend

## Install

```bash
npm install
```

## Environment

Copy `.env.example` to `.env`, then set:

```bash
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=trendai_app
DB_PASSWORD=your_password
DB_NAME=trendai
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=
AI_PROVIDER=gemini
```

`GEMINI_API_KEY` is required for live chart image analysis. If it is missing, the upload endpoint returns a clear backend error and records the failed analysis.

## Database

Run `database/schema.sql` in MySQL to create or update the tables:

```bash
mysql -u trendai_app -p < database/schema.sql
```

## Run

```bash
npm run dev
```

## Test Upload Endpoint

Use a bearer token from `/api/auth/login`, then send a multipart request:

```bash
curl -X POST http://localhost:5000/api/analyze/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "chart=@/path/to/chart.png" \
  -F "assetHint=XAUUSD" \
  -F "timeframeHint=15M"
```

The same handler is also available at `/api/uploads`.

## Gemini API Key

Create a Gemini API key from Google AI Studio:

1. Go to `https://aistudio.google.com/app/apikey`.
2. Sign in with your Google account.
3. Create an API key.
4. Add it to `.env` as `GEMINI_API_KEY`.
5. Restart the backend.
