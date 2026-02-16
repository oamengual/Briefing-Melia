#!/bin/bash
POSSIBLE_PATHS=(
    "/usr/local/bin/node"
    "/usr/bin/node"
    "/opt/homebrew/bin/node"
    "$HOME/.volta/bin/node"
    "$HOME/.fnm/current/bin/node"
)

# Check common paths
for path in "${POSSIBLE_PATHS[@]}"; do
    if [ -x "$path" ]; then
        echo "Found node at: $path"
        "$path" -v
        exit 0
    fi
done

# Try to find via nvm
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
    echo "Found nvm, using it..."
    nvm use default > /dev/null
    node_path=$(which node)
    if [ -x "$node_path" ]; then
        echo "Found node via nvm at: $node_path"
        "$node_path" -v
        exit 0
    fi
fi

echo "Node.js not found."
exit 1
