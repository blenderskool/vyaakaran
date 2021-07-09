#!/bin/bash

# npm install inside website and editor if node_modules folder is not present
if [ ! -d "./website/node_modules" ] 
then
    pushd ./website
        npm install
    popd
fi

if [ ! -d "./editor/node_modules" ] 
then
    pushd ./editor
        npm install
    popd
fi

# Build the website
pushd ./website
npm run build
mv ./build ../build
popd

# Build the editor and move it under /playground
pushd ./editor
npm run build
mv ./dist ../build/playground
popd
