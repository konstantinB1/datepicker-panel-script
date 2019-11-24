import DatepickerScript from '../lib/Datepicker.js'

class MyDatepicker {

  /**
   * Constructor
   */
  constructor () {
    this.datepickerScript = new DatepickerScript({ listener: this.dayClickCallbackListener })

    this.datepickerScript.computePanel()

    this.initListeners()
    this.render()
  }

  /**
   * Day click instance
   * 
   * @param {DatepickerScriptDay} dayInstance 
   */
  dayClickCallbackListener (dayInstance) {
    console.log(dayInstance)
  }

  /**
   * Set listeners
   */
  initListeners () {
    document.querySelector('#prev').addEventListener('click', () => {
      this.datepickerScript.prevMonth()
      this.render()
    })
    
    document.querySelector('#next').addEventListener('click', () => {
      this.datepickerScript.nextMonth()
      this.render()
    })
  }

  /**
   * Render datepicker table
   */
  render () {
    const datepicker = this.datepickerScript
    const dpBody = document.querySelectorAll('.datepicker-body tr')
    const data = datepicker.formatMatrixGrid()
    const currentDate = datepicker.getCurrentDate
    
    document.querySelector('#date-info').innerHTML = moment(currentDate).format('MMMM - YYYY')
  
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const getRowTr = dpBody[i]
      
      if (getRowTr) {
        const getCells = getRowTr.querySelectorAll('td')
  
        for (let x = 0; x < getCells.length; x++) {
          const cell = getCells[x]
          const dateData = row[x] || {}

          // Add elements to listener
          dateData.addToListener(cell)
  
          cell.innerHTML = moment(dateData.date).format('DD')
        }
      }
    }  
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => new MyDatepicker())
