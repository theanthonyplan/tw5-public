#!/bin/bash

tiddlywiki tw5 --server 8080 &> tw5.log &
export TW_projName_PID=$!

node projNameTW-auth/app.js &> twAuth.log  &
export TW_AUTH_projName_PID=$!
