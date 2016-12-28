#!/bin/bash

kill `pgrep "node"` 2>/dev/null

nodejs ./api/api.js &

grunt && sudo cp -rf app/* /var/www/html/
