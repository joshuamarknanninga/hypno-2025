#!/bin/bash
set -e

echo "Starting mobile app build..."

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null
then
    echo "Expo CLI not found, installing globally..."
    npm install -g expo-cli
fi

# Clean previous builds (optional)
echo "Cleaning previous build cache..."
expo start -c

# Run EAS build if available, otherwise fallback to classic build
if command -v eas &> /dev/null
then
    echo "Running EAS build for Android and iOS..."
    eas build --platform android --profile production
    eas build --platform ios --profile production
else
    echo "EAS CLI not found, running classic Expo build..."
    echo "Run 'expo build:android' and 'expo build:ios' manually as needed."
fi

echo "Build script finished."
