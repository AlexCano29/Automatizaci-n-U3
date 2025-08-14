#!/bin/sh
echo "Starting JSON Server on port $API_PORT"
json-server --watch db.json --port $API_PORT --host 0.0.0.0