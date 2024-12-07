#!/bin/bash

if [ ! -f database.db ]; then
  python app/models.py
fi

# Run the main application
exec "$@"