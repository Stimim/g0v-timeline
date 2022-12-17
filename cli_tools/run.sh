#!/bin/bash

wget 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVuIen0HdVAjbUEs7KppNZt0XRbFrq5Rhfvw9bu5iuwc6bIbolkvtpKfb9tp0OSQjRWULhOaJhHTSi/pub?gid=1086308132&single=true&output=csv' -O input.csv
python3 convert.py input.csv >../src/app/data/g0v-events.ts

