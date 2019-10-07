const DATE_MATRIX_CALC = 42
const DAYS_LIST = {
  'tue': 1,
  'wed': 2,
  'thu': 3,
  'fri': 4,
  'sat': 5,
  'sun': 6
}

class DatepickerBuilderDay {

  constructor (dateObj) {
    this.date = dateObj
    this.day = dateObj.toDateString().slice(8, 10)

  }
}

class DatepickerPanelScript {

  /**
   * DatepickerPanelScript constructor
   * 
   * @param {Object} dateObj 
   */
  constructor (dateObj, options = {}) {
    this._date = null
    this.data = []
    this._monthsDays = [31, this._checkFebLeapYear(), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    this.setDate = dateObj
  }

  /**
   * Checks february leap year
   */
  _checkFebLeapYear () {
    const year = this.getFullYear || (new Date()).getFullYear()
    return year % 4 === 0 ? 29 : 28
  }

  /**
   * Get month name
   */
  get getMonthName () {
    const monthName = this._date.toDateString().slice(4, 7)
    return monthName
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
    return this._date.getMonth()
  }

  /**
   * Get day number
   */
  get getDay () {
    return this._date.getDay()
  }

  /**
   * Clear panel data
   */
  clear () {
    this.data = []
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
   * @return {DatepickerPanelScript}
   */
  nextMonth (m = this.getMonth + 1, y = this.getFullYear) {
    this.setDate = {year: y, month: m, day: 1}
    this.clear()
    this.computePanel(m, y)

    return this
  }

  /**
   * Gets previous month relative to the last date object
   * 
   * @param {Number} m 
   * @param {Number} y 
   * @return {DatepickerPanelScript}
   */
  prevMonth (m = this.getMonth - 1, y = this.getFullYear) {
    this.setDate = {year: y, month: m, day: 1}
    this.clear()
    this.computePanel(m, y)

    return this
  }

  /**
   * Gets day string name from iso string
   * 
   * @param {String} d 
   */
  _getDayStringName (d) {
    return d.slice(0, 3).toLowerCase()
  }

  /**
   * Creates new date panel
   * 
   * @param {Number} month 
   * @param {Number} year 
   */
  computePanel (month = this.getMonth, year = this.getFullYear) {
    const monthsDays = this._monthsDays
    monthsDays[1] = this._checkFebLeapYear()

    const getUTCFirstInMonth = new Date(Date.UTC(year, month, 1)).toDateString()
    const getDayStringName = this._getDayStringName(getUTCFirstInMonth)
    const getDaysInMonthBefore = this.getMonth === 0 ? monthsDays[11] : monthsDays[month - 1]
    const curMonth = monthsDays[month]

    if (getDayStringName !== 'mon') {
      const minDays = DAYS_LIST[getDayStringName]
      const len = getDaysInMonthBefore - minDays

      for (let i = getDaysInMonthBefore; i > len; i--) {
        const createItem = new DatepickerBuilderDay(
          new Date(Date.UTC(this.getFullYear, month - 1, i))
        )

        this.data.unshift(createItem)
      }

      for (let i = 1; i <= curMonth; i++) {
        const createItem = new DatepickerBuilderDay(
          new Date(Date.UTC(this.getFullYear, month, i))
        )

        this.data.push(createItem)
      }

      const curPanelLen = this.data.length
      const getRemaingingDiff = DATE_MATRIX_CALC - curPanelLen

      for (let i = 1; i <= getRemaingingDiff; i++) {
        const createItem = new DatepickerBuilderDay(
          new Date(Date.UTC(this.getFullYear, month + 1, i))
        )

        this.data.push(createItem)
      }
    }

    return this
  }

  /**
   * Formats data for easier UI integration. Format is 6x7
   */
  formatMatrixGrid () {
    const format = [[], [], [], [], [], [], []]
    const len = this.data.length

    for (let i = 0, r = 0; i < len; i++) {
      const row = format[r]
      const rLen = row.length
      const item = this.data[i]

      if (rLen === 6) {
        row.push(item)
        r++
        continue
      }

      row.push(item)
    }

    this.data = format
    return this
  }
}
