module.exports = {
  // TypeScript files: fix lint, format, then type-check the whole project
  // tsc uses a function () => ... so lint-staged does NOT append filenames
  // (appending filenames breaks tsconfig.json resolution)
  '*.ts': [
    'eslint --fix',
    'prettier --write',
    () => 'tsc --noEmit',
  ],

  // JSON and Markdown: format only
  '*.{json,md}': ['prettier --write'],
}
