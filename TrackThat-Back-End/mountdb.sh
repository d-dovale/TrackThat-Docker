#!/bin/bash

echo "Runnnig mount"

if [ ! -f database.db ]; then
  python app/models.py
fi

echo "Ran mount"

# Run the main application
exec "$@"