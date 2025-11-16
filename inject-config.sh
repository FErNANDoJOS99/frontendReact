#!/bin/sh

CONFIG_FILE="/app/build/config.js"

cat <<EOF | tee $CONFIG_FILE > /dev/null
window._env_ = {
  REACT_APP_API_BASE_URL: "$REACT_APP_API_BASE_URL"
};
EOF

echo "Config generado: API_BASE_URL=$REACT_APP_API_BASE_URL"
