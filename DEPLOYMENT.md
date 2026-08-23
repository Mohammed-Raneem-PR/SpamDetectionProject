# Deployment guide

This repository includes a `render.yaml` Blueprint and Dockerfile for the
FastAPI backend. The Render service uses a persistent disk at `/var/data` to
preserve the SQLite database between deploys and restarts.

## 1. Deploy the API on Render

1. Sign in to Render and connect your GitHub account.
2. Select **New > Blueprint** and choose this repository and the `main` branch.
3. Render reads `render.yaml` from the repository root.
4. Provide the required values:
   - `GMAIL_EMAIL`
   - `GMAIL_PASSWORD` (a newly generated Gmail App Password)
   - `ALLOWED_ORIGINS` (your Vercel URL, such as `https://your-app.vercel.app`)
5. Deploy and copy the resulting `https://…onrender.com` API URL.

## 2. Deploy the frontend on Vercel

1. Import the same GitHub repository in Vercel.
2. Set **Root Directory** to `frontend`.
3. Set `VITE_API_URL` to the Render API URL copied in step 1.
4. Deploy.

If you add or change `VITE_API_URL`, redeploy Vercel because Vite embeds this
value at build time.

## Security note

The previous Gmail app password was committed before deployment preparation.
Revoke it in the Google Account security settings and create a new App Password
before setting `GMAIL_PASSWORD` in Render. Do not commit real `.env` files.
