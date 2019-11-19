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

export { DatepickerScriptUtils }