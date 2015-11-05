#!/bin/bash

pwd
ls

if hash sass 2>/dev/null; then
    sass --update ./client/css:./public-debug/css --sourcemap=auto;
else
    echo >&2 "I require sass but it's not installed.  Continuing without sass.";
fi

