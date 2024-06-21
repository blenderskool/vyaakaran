#!/bin/bash

# Build the website
pnpm run website:build
mv ./website/build ./build

# Build the editor and move it under /playground
npm run editor:build
mv ./editor/dist ./build/playground
