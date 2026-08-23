#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

command -v timeout >/dev/null || {
  echo "build-github-pages.sh requires GNU timeout." >&2
  exit 69
}

next_cli="${SITES_PROJECT_ROOT}/node_modules/.bin/next"
if [[ ! -x "${next_cli}" ]]; then
  echo "Next.js is unavailable. Run npm run install:ci before building." >&2
  exit 69
fi

repository="${GITHUB_REPOSITORY:-ecastrob/Bco-2-485-guide}"
repository_owner="${GITHUB_REPOSITORY_OWNER:-${repository%%/*}}"
repository_name="${repository##*/}"

export GITHUB_PAGES=true
export GITHUB_REPOSITORY="${repository}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://${repository_owner}.github.io/${repository_name}}"

echo "Building static GitHub Pages site for /${repository_name}/..."
timeout \
  --signal=TERM \
  --kill-after="${PAGES_BUILD_KILL_AFTER:-10s}" \
  "${PAGES_BUILD_TIMEOUT:-3m}" \
  "${next_cli}" build
