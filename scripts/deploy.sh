#!/bin/bash
while true
do
    nodejs ../index.js | tee -a /var/log/iOS_build.log
done
