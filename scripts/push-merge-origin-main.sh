#!/usr/bin/env bash
# Run in Terminal.app (not the agent): your SSH key must be loaded (ssh-add).
set -euo pipefail
cd "$(dirname "$0")/.."

git remote set-url origin git@github.com:YawAntwiOwusu/yaw-website.git

echo "==> Fetch origin"
git fetch origin

echo "==> Checkout main and merge origin/main"
git checkout main
git merge origin/main --no-edit

echo "==> Push main"
git push origin main

echo "==> Push feature branch"
git push -u origin feature/site-layout-notes-content

echo "Done."
