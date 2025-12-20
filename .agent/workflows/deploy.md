---
description: Deploy the latest changes to Vercel via Git
---

1.  Check the current git status to ensure the working directory is clean.
    ```bash
    git status
    ```

2.  Add all changes to the staging area.
    ```bash
    git add .
    ```

3.  Commit the changes with a descriptive message (ask the user for a message if one isn't clear, or use a generic "deploy" message).
    ```bash
    git commit -m "deploy: update application code"
    ```

4.  Push the changes to the 'main' branch to trigger the Vercel deployment.
    ```bash
    git push origin main
    ```

5.  Notify the user that the deployment has been triggered.
