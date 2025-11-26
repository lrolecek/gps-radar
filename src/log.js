
class Log {
  constructor(element) {
    this.element = document.querySelector(element)
  }

  message(msg) {
    this.element.textContent += msg + '\n'
  }

  divider() {
    this.message('---------------')
  }
}

export const log = new Log('#log pre')