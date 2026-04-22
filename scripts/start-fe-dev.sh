#!/usr/bin/env bash

set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
FRONTEND_DIR="${REPO_ROOT}/frontend"

echo "Starting frontend development server..."
cd "${FRONTEND_DIR}"

usage() {
  echo "Usage: $0 <app-name>"
  echo ""
  echo "Arguments:"
  echo "  app-name    Name of the application to process."
  echo ""
  echo "Available apps:"
  echo "  - cinema"
  echo "  - dashboard"
  echo ""
  echo "Example:"
  echo "  $0 cinema"
  exit 1
}

if [ "$#" -ne 1 ]; then
  usage
fi

if [ ! -f "package.json" ]; then
  echo "package.json not found in ${FRONTEND_DIR}"
  exit 1
fi

if [ -d "node_modules" ]; then
  echo "node_modules already exists, skipping npm install"
else
  echo "Installing dependencies..."
  npm install
fi

echo "Starting development server for ${1}..."
npm run dev:${1}
