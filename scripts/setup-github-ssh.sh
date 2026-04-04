#!/usr/bin/env bash
# Run once per clone (or after remote was set to HTTPS). Uses SSH for GitHub so
# macOS Keychain HTTPS credentials (e.g. another GitHub account) are not used.
set -euo pipefail
cd "$(dirname "$0")/.."

git remote set-url origin git@github.com:YawAntwiOwusu/yaw-website.git
git config --local url."git@github.com:".insteadOf "https://github.com/"

echo "OK: origin → SSH; https://github.com/ rewrites to git@github.com: for this repo."
git remote -v
