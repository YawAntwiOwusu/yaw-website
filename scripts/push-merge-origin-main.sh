#!/usr/bin/env bash
# Run in Terminal.app (not the agent): your SSH key must be loaded (ssh-add).
# Rewrites GitHub HTTPS → SSH so Keychain does not use the wrong GitHub account.
set -euo pipefail
cd "$(dirname "$0")/.."

./scripts/setup-github-ssh.sh

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
