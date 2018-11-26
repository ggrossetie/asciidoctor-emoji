#!/bin/bash
# Package a distribution as a zip and tar.gz archive

set -e

npm run dist
mkdir bin
cd dist/
zip -r ../bin/asciidoctor-emoji.dist.zip .
tar -zcvf ../bin/asciidoctor-emoji.dist.tar.gz .
cd -
