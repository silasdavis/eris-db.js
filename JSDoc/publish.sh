#!/usr/bin/env sh

# Publish documentation to the Eris website.

name=$(basename $PWD)
docs_site=docs.erisindustries.com
repo=$PWD
version=$(cat package.json | jq --raw-output .version)

# Build

## Publish documentation for the most recent published version.
git checkout --force tags/v$version

npm run doc

cd $HOME
git clone git@github.com:eris-ltd/$docs_site.git
cd $docs_site/documentation
mkdir --parents $name
cd $name
mv $repo/doc $version
ln --symbolic $version latest

# Commit and push if there are changes.

if [ -z "$(git status --porcelain)" ]; then
  echo "All Good!"
else
  git config --global user.email "billings@erisindustries.com"
  git config --global user.name "Billings the Bot"
  git add -A :/ &&
  git commit --message "$name build number $CIRCLE_BUILD_NUM doc generation" &&
  git push origin master
fi
