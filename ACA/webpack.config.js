const config = {
  mode: 'development', // "production" | "development" | "none"
	resolve: {
		fallback: {

    },
    extensions: ['*', '.mjs', '.js', '.json'],
  },
	
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,s
        type: 'javascript/auto',	
      }
    ]
  }
}

module.exports = config