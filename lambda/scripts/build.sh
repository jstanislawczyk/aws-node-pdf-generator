#!/bin/bash
cd ../functions

echo "Building lambdas"
echo ""

for directory in * ; do
  if [ -d "$directory" ] ; then
    echo ""
    echo "Building $directory"
    echo ""

    cd $directory
    npm install
    zip -r $directory.zip ./*
    mv ./$directory.zip ../../../terraform
    cd ../
  fi
done
