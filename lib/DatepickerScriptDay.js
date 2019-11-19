class DatepickerScriptDay {

  /**
   * DatepickerPanelScriptDay constructor
   * 
   * @param {Date}     dateObj 
   * @param {Function} listener
   * @param {DatepickerUtils|Object}
   */
  constructor (dateObj = {}, listener = () => ({}), utils = null) {
    this.date = dateObj
    this._listener = listener
    this.el = null
    this._bindedLst = null
    this.utils = utils
  }

  /**
   * Listener callback fn
   * 
   * @param {MouseEvent} e 
   */
  _listenerFn (e) {
    this._listener(this, e)
  }

  /**
   * Adds element to single callback fn
   * 
   * @param {HTMLElement} el 
   */
  addToListener (el) {
    this.el = el
    this._bindedLst = this._listenerFn.bind(this)
    if (this._listener && typeof this._listener === 'function') {
      this.el.addEventListener('click', this._bindedLst, true)
    }
  }

  /**
   * Removes element from callback, triggered on panel change
   */
  removeListener () {
    if (this.el && this._listener && this._bindedLst) {
      this.el.removeEventListener('click', this._bindedLst, true)
    }
  }
}

export { DatepickerScriptDay }