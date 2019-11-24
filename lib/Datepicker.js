class DatepickerScript {

  /**
   * DatepickerScript constructor
   * 
   * @param {Object} dateObj 
   */
  constructor (options = {}) {
    this._date = null
    this._data = []
    this.listener = options.listener || undefined
    this.setDate = options.date || null
  }

  /**
   * Get date
   */
  get getCurrentDate () {
    return this._date
  }

  /**
   * Get formated data
   */
  get getData () {
    return this._data
  }

  /**
   * Gets full year
   */
  get getFullYear () {
    return this._date && this._date.getFullYear()
  }

  /**
   * Get month number
   */
  get getMonth () {
    return this._date && this._date.getMonth()
  }

  /**
   * Sets new date object
   * 
   * @param {Object} dateObject
   */
  set setDate (dateObj = null) {
    if (!dateObj) {
      this._date = new Date()
      return
    }
  
    const { year, month, day } = dateObj
    this._date = new Date(year, month, day)
  }

  /**
   * Gets next month relative to the last date object
   * 
   * @param {Number} m 
   * @param {Number} y
   * @return {DatepickerScript}
   */
  nextMonth (m = this.getMonth + 1, y = this.getFullYear) {
    this.setDate = { year: y, month: m, day: 1 }
    this.computePanel(m, y)

    return this
  }

  /**
   * Gets previous month relative to the last date object
   * 
   * @param {Number} m 
   * @param {Number} y 
   * @return {DatepickerScript}
   */
  prevMonth (m = this.getMonth - 1, y = this.getFullYear) {
    this.setDate = { year: y, month: m, day: 1 }
    this.computePanel(m, y)

    return this
  }

  /**
   * Get day string name
   * 
   * @param  {Date} date
   * @return {String}
   */
  getDayStrName (date = this._date) {
    return date.toDateString().slice(0, 3).toLowerCase()
  }

  /**
   * Get enum list of days
   * 
   * @param {Object}
   */
  getEnumDays (day) {
    const days = {
     'mon': 0,
     'tue': 1,
     'wed': 2,
     'thu': 3,
     'fri': 4,
     'sat': 5,
     'sun': 6       
    }
 
    if (day in days) {
      return days[day]
    }

   return days
 }

  /**
   * Get month days
   * 
   * @param {Number} year 
   * @param {Number} month
   * @param {Array|Number}
   */
  getMonthDays (date = this._date, month = null) {
    const year = date.getFullYear()
    const months = [31, (year % 4 === 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    if (month) {
      return months[month]
    }

    return months
  }

  /**
   * Get month
   * 
   * @param {Date} date
   * @param {String}
   */
  getMonthName (date = this._date) {
    return date.toDateString().slice(4, 7)
  }

  /**
   * Sets new day instance
   * 
   * @param  {Number} m 
   * @param  {Number} d 
   * @return {DatepickerScriptDay}
   */
  _setDayInstanceItem (m, d) {
    const utcDayDate = new Date(Date.UTC(this.getFullYear, m, d))
    return new DatepickerScriptDay(utcDayDate, this.listener)
  }

  /**
   * Removes listeners from day instance, and clears all data
   */
  clear () {
    this._data.forEach(dInst => {
      if (dInst && dInst instanceof DatepickerScriptDay && dInst._listener) {
        dInst.removeListener()
      }
    })

    this._data = []
  }

  /**
   * Creates new date panel
   * 
   * @param {Number} month 
   * @param {Number} year 
   */
  computePanel (month = this.getMonth, year = this.getFullYear) {
    this.clear()

    const getUTCFirstInMonth = new Date(Date.UTC(year, month, 1))
    const monthsDays = this.getMonthDays(this._date)
    const getDayStringName = this.getDayStrName(getUTCFirstInMonth)


    if (getDayStringName !== 'mon') {
      const minDays = this.getEnumDays(getDayStringName)
      const getDaysInMonthBefore = this.getMonth === 0 ? monthsDays[11] : monthsDays[month - 1]
      const getLastMonthIndex = this.getMonth === 0 ? 11 : this.getMonth - 1
      const len = getDaysInMonthBefore - minDays
      for (let i = getDaysInMonthBefore; i > len; i--) this._data.unshift(this._setDayInstanceItem(getLastMonthIndex, i))
    }

    const computeCurMonth = month >= 11 ? 0 : month
    const curMonth = monthsDays[computeCurMonth]
    for (let i = 1; i <= curMonth; i++) this._data.push(this._setDayInstanceItem(month, i))

    const curPanelLen = this._data.length
    const DATE_MATRIX_CALC = 42

    const getRemaingingDiff = DATE_MATRIX_CALC - curPanelLen
    for (let i = 1; i <= getRemaingingDiff; i++) this._data.push(this._setDayInstanceItem(month + 1, i))

    return this
  }

  /**
   * Formats data for easier UI integration. Format is 6x7
   */
  formatMatrixGrid () {
    const format = [[], [], [], [], [], []]
    const len = this._data.length

    for (let i = 0, r = 0; i < len; i++) {
      const row = format[r]
      const rLen = row.length
      const item = this._data[i]

      if (rLen === 6) {
        row.push(item)
        r++
        continue
      }

      row.push(item)
    }

    return format
  }
}

class DatepickerScriptDay {

  /**
   * DatepickerPanelScriptDay constructor
   * 
   * @param {Date}     dateObj 
   * @param {Function} listener
   */
  constructor (dateObj = {}, listener = () => ({})) {
    this.date = dateObj
    this._listener = listener
    this.el = null
    this._bindedLst = null
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

export default DatepickerScript