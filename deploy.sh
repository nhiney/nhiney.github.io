#!/bin/bash
set -e

REPO_ROOT=$(git rev-parse --show-toplevel)
WORKTREE_DIR=$(mktemp -d)
BRANCH="gh-pages"

cleanup() {
  cd "$REPO_ROOT"
  git worktree remove "$WORKTREE_DIR" --force 2>/dev/null || true
  rm -rf "$WORKTREE_DIR"
}
trap cleanup EXIT

echo "Building portfolio..."
cd "$REPO_ROOT/portfolio"
bun run build

echo "Preparing gh-pages branch..."
cd "$REPO_ROOT"

if git ls-remote --exit-code origin "$BRANCH" > /dev/null 2>&1; then
  git fetch origin "$BRANCH"
  git worktree add "$WORKTREE_DIR" "$BRANCH"
else
  git worktree add --orphan -b "$BRANCH" "$WORKTREE_DIR"
fi

echo "Syncing build output..."
rsync -a --delete \
  --exclude='.git' \
  "$REPO_ROOT/portfolio/out/" "$WORKTREE_DIR/"

# Required for GitHub Pages to serve _next/ assets without Jekyll processing
touch "$WORKTREE_DIR/.nojekyll"

cd "$WORKTREE_DIR"
git add -A

if git diff --cached --quiet; then
  echo "Nothing changed, skipping deploy."
  exit 0
fi

COMMIT_MSG="deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG"
git push origin "$BRANCH"

echo ""
echo "Deployed to branch '$BRANCH'."
echo "Ensure GitHub Pages is set to serve from: Branch '$BRANCH' / root (/)"
