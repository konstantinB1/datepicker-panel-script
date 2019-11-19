class DatepickerScript {

  /**
   * DatepickerScript constructor
   * 
   * @param {Object} dateObj 
   */
  constructor (options = {}) {
    this._date = null
    this.data = []
    this.listener = options.listener || undefined
    this.utilsClass = options.utilsClass || DatepickerScriptUtils
    this._utilInternal = new DatepickerScriptUtils()

    const dayCl = options.dayClass
    if (dayCl) {
      if (!DatepickerScriptDay.isPrototypeOf(dayCl)) {
        const clName = dayCl.name
        console.warn(`[${clName}] class needs to extend DatepickerScriptDay. dayClass will default to DatepickerScriptDay class!`)
        this.dayClass = DatepickerScriptDay
      } else {
        this.dayClass = dayCl
      }
    } else {
      this.dayClass = DatepickerScriptDay
    }
  
    this.setDate = options.date || null
  }

  /**
   * Gets full year
   */
  get getFullYear () {
    return this._date && this._date instanceof Date && this._date.getFullYear()
  }

  /**
   * Get month number
   */
  get getMonth () {
    return this._date && this._date instanceof Date && this._date.getMonth()
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
    this.setDate = {year: y, month: m, day: 1}
    this.computePanel(m, y)

    return this
  }

  /**
   * Gets previous month relative to the last date object
   * 
   * @param {Number} m 
   * @param {Number} y 
   * @return {DatepickerScrip}
   */
  prevMonth (m = this.getMonth - 1, y = this.getFullYear) {
    this.setDate = {year: y, month: m, day: 1}
    this.computePanel(m, y)

    return this
  }

  /**
   * Sets new day instance
   * 
   * @param  {Number} m 
   * @param  {Number} d 
   * @return {DatepickerScriptDay}
   */
  setDayInstanceItem (m, d) {
    const utcDayDate = new Date(Date.UTC(this.getFullYear, m, d))
    return new this.dayClass(utcDayDate, this.listener, new this.utilsClass(utcDayDate))
  }

  /**
   * Removes listeners from day instance, and clears all data
   */
  clear () {
    this.data.forEach(dInst => {
      if (dInst && dInst instanceof this.dayClass && dInst._listener) {
        dInst.removeListener()
      }
    })

    this.data = []
  }

  /**
   * Creates new date panel
   * 
   * @param {Number} month 
   * @param {Number} year 
   */
  computePanel (month = this.getMonth, year = this.getFullYear) {
    this.clear()

    const { getMonthDays, getEnumDays, getDayStrName } = this._utilInternal

    const getUTCFirstInMonth = new Date(Date.UTC(year, month, 1))
    const monthsDays = getMonthDays(this._date)
    const getDayStringName = getDayStrName(getUTCFirstInMonth)

    if (getDayStringName !== 'mon') {
      const minDays = getEnumDays(getDayStringName)
      const getDaysInMonthBefore = this.getMonth === 0 ? monthsDays[11] : monthsDays[month - 1]
      const len = getDaysInMonthBefore - minDays
      for (let i = getDaysInMonthBefore; i > len; i--) this.data.unshift(this.setDayInstanceItem(month - 1, i))
    }

    const curMonth = monthsDays[month]
    for (let i = 1; i <= curMonth; i++) this.data.push(this.setDayInstanceItem(month, i))

    const curPanelLen = this.data.length
    const DATE_MATRIX_CALC = 42

    const getRemaingingDiff = DATE_MATRIX_CALC - curPanelLen
    for (let i = 1; i <= getRemaingingDiff; i++) this.data.push(this.setDayInstanceItem(month + 1, i))

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

    return format
  }
}

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

class DatepickerScriptUtils {

  constructor (date) {
    this.date = date
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
   * Get day string name
   * 
   * @param  {Date} date
   * @return {String}
   */
  getDayStrName (date) {
    const d = date || this.date
    return d.toDateString().slice(0, 3).toLowerCase()
  }

  /**
   * Get day
   * 
   * @param {Date} date
   * @param {String}
   */
  getDay (date) {
    const d = date || this.date
    return d.toDateString().slice(8, 10)
  }

  /**
   * Get year
   * 
   * @param {Date} date
   * @param {Number}
   */
  getYear (date) {
    const d = date || this.date
    return d.getFullYear()
  }

  /**
   * Get month
   * 
   * @param {Date} date
   * @param {Number}
   */
  getMonth (date) {
    return date.getMonth()
  }

  /**
   * Get month days
   * 
   * @param {Number} year 
   * @param {Number} month
   * @param {Array|Number}
   */
  getMonthDays (date, month = null) {
    const d = date || this.date
    const year = d.getFullYear()
    const feb = (year % 4 === 0 ? 29 : 28)
    const months = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    if (month) {
      return months[month]
    }

    return months
  }

  /**
   * Get is today
   * 
   * @param {Date} date
   * @param {Boolean}
   */
  isToday (date) {
    const d = date || this.date
    return (d.toDateString() === new Date().toDateString())
  }

  /**
   * Get total elapsed days
   * 
   * @param  {Date} date
   * @return {Number}
   */
  getOffsetFromYearStartToToday (date) {
    const d = date || this.date
    const allMonths = this.getMonthDays(d.getFullYear()).slice()
    let i = d.getMonth(), totalDays = 0

    while (i--) {
      const curMonthDays = allMonths[i]
      totalDays += curMonthDays
    }

    const today = this.getDay(d)
    return Math.floor(totalDays - today)
  }
}

export { DatepickerScriptDay, DatepickerScript, DatepickerScriptUtils }