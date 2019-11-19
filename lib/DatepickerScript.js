import { DatepickerScriptUtils } from './DatepickerScriptUtils.js'
import { DatepickerScriptDay } from './DatepickerScriptDay.js'

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

export { DatepickerScript }