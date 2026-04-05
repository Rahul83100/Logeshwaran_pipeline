# Anagha's Daily Tasks - Overlap / Quality Assurance

**Date:** April 5, 2026

## Overview
Please pull the latest code from the `develop` branch. Ensure that you branch off from or work directly in `develop` for the duration of this testing phase because it has now been fully synced with all recent administrative panel additions from the `main` branch. 

If you encounter any errors in the `develop` branch, keep in mind they represent bugs present in `main`, so prioritizing and fixing them here is critical.

## Tasks

### 1. Overall Security Testing
- Perform comprehensive security testing across the entire website.
- Check for authorization vulnerabilities in the Admin forms and dashboards.
- Verify proper API endpoint protection to prevent unauthorized data manipulation.

### 2. Form & Field Data Insertion Testing
- Thoroughly test the CRUD (Create, Read, Update, Delete) operations for every single field on the portfolio's admin sections (Experiences, Research, Home Page Components, Banners, Contact Forms, etc.).
- You MUST temporarily insert test data into every field to ensure it is accurately reflected on the frontend.
- Once successfully confirmed, carefully remove your test insertions to keep the database clean.

### 3. Bug Hunting & General QA
- Explore all edge cases visually (responsive mobile UI, padding alignment) and functionally.
- Identify, track, and document any bugs you discover during testing.
- If you find any minor bugs, feel free to correct them in your `develop` branch structure. For major architectural bugs, document them in `BUG_REPORT.md` (or a similar tracking document) and wait for team review. 

*Note: Proceed efficiently, prioritize thoroughness during field data insertion workflows.*
