#!/usr/bin/env bash
# EAS Build pre-install hook to set NODE_BINARY and NODE_ENV
# This ensures Node.js is found during the Gradle build

# Find node executable and set NODE_BINARY if not already set
if [ -z "$NODE_BINARY" ]; then
  # Try to find node in common locations
  if [ -f "$HOME/.nvm/versions/node/v18.18.0/bin/node" ]; then
    export NODE_BINARY="$HOME/.nvm/versions/node/v18.18.0/bin/node"
  elif command -v node > /dev/null 2>&1; then
    export NODE_BINARY=$(command -v node)
  elif [ -f "/usr/local/bin/node" ]; then
    export NODE_BINARY="/usr/local/bin/node"
  else
    export NODE_BINARY="node"
  fi
fi

# Set NODE_ENV if not already set (fallback, eas.json should set this)
if [ -z "$NODE_ENV" ]; then
  export NODE_ENV="production"
fi

echo "NODE_BINARY is set to: $NODE_BINARY"
echo "NODE_ENV is set to: $NODE_ENV"

