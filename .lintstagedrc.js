const path = require('path')

const eslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`

const prettierCommand = 'prettier --config .prettierrc.json --write'

module.exports = {
  '*.{js,jsx,ts,tsx}': [eslintCommand, prettierCommand],
  '*.css': [prettierCommand],
}
