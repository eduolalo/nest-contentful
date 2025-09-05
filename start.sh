#!/usr/bin/env sh

node --run migration:run:prod
node --run start:prod
