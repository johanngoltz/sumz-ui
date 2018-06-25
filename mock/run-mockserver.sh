#!/bin/bash
BASEDIR="$( cd "$(dirname "$0")" ; pwd -P )"
echo "$BASEDIR"
java -jar \"$BASEDIR/sandbox\" run  --base=\"$BASEDIR\" --state=\"$BASEDIR/state.json\"
