export default [
  {
    input: 'src/asciidoctor-emoji.js',
    output: {
      file: 'dist/asciidoctor-emoji.cjs',
      format: 'cjs',
      exports: 'named',
    },
  },
  {
    input: 'src/asciidoctor-emoji.js',
    output: {
      file: 'dist/browser/asciidoctor-emoji.js',
      format: 'umd',
      name: 'AsciidoctorEmoji',
      exports: 'named',
    },
  },
]
