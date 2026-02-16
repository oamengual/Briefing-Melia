#!/bin/bash

# Use system python3 (3.9.6) which is compatible with NiceGUI
PYTHON_CMD="python3"

echo "Using Python: $PYTHON_CMD"
$PYTHON_CMD --version

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON_CMD -m venv venv
fi

source venv/bin/activate

# Add Repo Node to PATH
export PATH=$PWD/../.node_bin/bin:$PATH

echo "Installing requirements..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Running NiceGUI App..."
python3 main.py
