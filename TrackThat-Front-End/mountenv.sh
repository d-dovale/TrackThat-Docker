#!/bin/sh

# Check if the environment variable exists and is an empty string
if [ -z "$VITE_API_KEY" ]; then
  unset VITE_API_KEY
  echo "VITE_API_KEY was unset because it was empty."
else
  echo "VITE_API_KEY exists and is not empty."
fi

# Run the main application
exec "$@"