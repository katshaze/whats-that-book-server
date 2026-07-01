# What's That Book server

**Note: The server is no longer deployed & the repo is archived.** 

Express API that searches Goodreads and returns book data for the [What's That Book frontend app](https://github.com/katshaze/whats-that-book). 

Deployed on Heroku.

## What it does

- `POST /book` — search by title/query (Goodreads search API)
- `POST /book/details` — fetch details for a book ID

The server proxies Goodreads XML responses and parses them to JSON. It uses CORS so the separate frontend can call it from the browser.

## Deployment

Heroku reads the **Procfile** at the repo root:

```
web: node ./bin/www
```

That tells Heroku to run the `web` process (the HTTP server) using `bin/www`, which listens on `process.env.PORT` (Heroku sets this automatically).

Setup:

1. Connect this GitHub repo to the Heroku app (or push via `heroku git:remote`)
2. Set config var: `GOODREADS_API_KEY`
3. Deploy — Heroku runs `npm install` and starts the Procfile `web` command

## Local dev

```bash
npm install
```

Create a `.env` file:

```
GOODREADS_API_KEY=your_key_here
PORT=3000
```

```bash
npm start
```

Server runs at `http://localhost:3000`.
