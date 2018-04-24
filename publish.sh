#!/bin/bash -x

set -euo pipefail

if [ "$#" -ne 1 ]; then
    echo "need arg"
    exit
fi

JQTEMP=$(mktemp)

jq ".version = \"$1\"" chrome/manifest.json > "$JQTEMP"
mv "$JQTEMP" chrome/manifest.json

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --pack-extension="chrome" --pack-extension-key="chrome.pem" --no-message-box
mv chrome.crx badnote.crx

OUT_DIR=$(mktemp -d)
source .env.sh
web-ext sign --source-dir chrome -a "$OUT_DIR"
mv "$OUT_DIR"/*xpi badnote.xpi

scp badnote.{xpi,crx} doser:~/