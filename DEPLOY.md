# Hosting this on GitHub Pages

This project now has a GitHub Actions workflow (`.github/workflows/deploy.yml`) that
automatically builds and publishes the site every time you push to `main`.

## One-time setup

1. **Create a new repo on GitHub** (https://github.com/new).
   - Any name works — the build automatically figures out the correct base
     path from the repo name. Suggested name: `invoice-generator`.
   - Leave it empty (no README/.gitignore) since you already have files.

2. **Push this code to it.** From inside this project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. **Turn on Pages.** In your new repo on GitHub: go to
   **Settings → Pages**, and under "Build and deployment" set
   **Source** to **GitHub Actions**.

That's it. The workflow will run automatically, and after a minute or two
your site will be live at:

```
https://<your-username>.github.io/<repo-name>/
```

You can watch the build progress under the **Actions** tab of your repo.

## After the first deploy

Any time you `git push` to `main`, the site rebuilds and redeploys automatically.
No manual steps needed.

## Notes

- This is a fully static site (Vite + React) — no backend/server required,
  so GitHub Pages is a perfectly good fit.
- Invoices are saved in the browser (not synced anywhere), so data won't
  carry over between devices/browsers.
- If you ever rename the repo, the next push will rebuild with the new
  correct path automatically — nothing to edit by hand.
