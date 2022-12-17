#!/usr/bin/env python

# HOWTO:
#
# Download CSV from https://docs.google.com/spreadsheets/d/1UBWZTLHtjaleq5qAc03OGKMRGMknUmz9PnKob-iFIk4/edit#gid=1086308132
# rename the CSV as input.csv
# Run this script
#   python coverter.py >../src/app/data/g0v-events.ts

import csv
import json

def main():

  with open('./input.csv', 'r') as f:
    reader = csv.DictReader(f)
    data = []
    for row in reader:
      if not row['date']:
        continue
      data.append(row)
    data.sort(key=lambda row: row['date'])
    print('export const EVENTS = %s;' % json.dumps(data) )

if __name__ == '__main__':
  main()
