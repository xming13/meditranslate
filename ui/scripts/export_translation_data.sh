#! bash
GOOGLE_SHEET_ID="1T96tsR2y0bZYUAnrjLv6ZX0j9gPMNQpI1F8AuRedRk0"
GID="916064672"

# Download google sheet and save a local copy so that it is versioned via git .
curl -o "meditranslate_consolidated.csv" "https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?gid=${GID}&format=csv"

node ./parse_csv_and_generate_translation_data.js
