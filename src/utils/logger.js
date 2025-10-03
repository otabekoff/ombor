const logger = {
  baseStyle: `
    padding: 2px 5px;
    background-color: #124F5C;
    border-radius: 4px;
    color: white;
  `,
  colors: {
    log: '#124F5C',
    error: '#ed2939',
    warn: '#f39c12'
  },

  log(message, _secondary) {
    if (this.config && this.config.debug) {
      const style = logger.baseStyle + `background-color: ${logger.colors.log}`
      console.log('%cOmbor', style, message)
    }
  },
  error(message, _secondary) {
    if (this.config && this.config.debug) {
      const style = logger.baseStyle + `background-color: ${logger.colors.error}`
      console.error('%cOmbor', style, message)
    }
  },
  warn(message, _secondary) {
    if (this.config && this.config.debug) {
      const style = logger.baseStyle + `background-color: ${logger.colors.warn}`
      console.warn('%cOmbor', style, message)
    }
  }
}

export default logger
