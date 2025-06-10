# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static author website for Marcel Lamothe, hosted on GitHub Pages. The site showcases books in the Jane Cullen series and provides social media connections.

## Development Commands

- **Local development**: `live-server` (requires `npm install -g live-server`)
- **Deployment**: Automatic via GitHub Pages when pushing to main branch

## Architecture

The site is a simple static HTML/CSS/JS website with the following structure:

- `index.html`: Single-page site containing header, book showcase, and social media section
- `css/style.css`: Custom CSS with CSS variables for theming (primary colors, background, cards)
- `js/main.js`: MailerLite integration script for newsletter functionality
- `assets/images/`: Book covers and social media logos

## Key Features

- Responsive book cards layout showcasing published and upcoming books
- Social media integration (Bluesky)
- Newsletter integration via MailerLite (account ID: 1285228)
- Clean, minimalist design with soft color scheme (misty rose background)

## Content Management

- Book information is hardcoded in HTML
- Images are stored in `assets/images/`
- Social links point to @marcel-writes.com on Bluesky and Amazon product pages
- Copyright notice includes contact email: marcel@marcel-writes.com