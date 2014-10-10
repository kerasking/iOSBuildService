#!/bin/bash
while true
do
    node ../index.js | tee -a /var/log/iOS_build.log
done
