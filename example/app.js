import { DatepickerScript } from '../lib/Datepicker.js'

const datepicker = new DatepickerScript()

const dpBody = document.querySelectorAll('.datepicker-body tr')
const curPanel = datepicker.computePanel()

function rerenderMonthPanel () {
  const data = curPanel.formatMatrixGrid()
  const len = data.length
  const today = document.querySelector('.today')

  if (today) {
    today.classList.remove('today')
  }
  
  document.querySelector('#date-info').innerHTML = `${datepicker.getMonthName} ${datepicker.getFullYear}`

  for (let i = 0; i < len; i++) {
    const row = data[i]
    const getRowTr = dpBody[i]
    
    if (getRowTr) {
      const getCells = getRowTr.querySelectorAll('td')
      for (let x = 0; x < getCells.length; x++) {
        const cell = getCells[x]
        const dateData = row[x] || {}
        dateData.addToListener(cell)

        cell.innerHTML = dateData.utils.getDay()
      }
    }
  }  
}

document.addEventListener('DOMContentLoaded', rerenderMonthPanel)

document.querySelector('#prev').addEventListener('click', () => {
  datepicker.prevMonth()
  rerenderMonthPanel()
})

document.querySelector('#next').addEventListener('click', () => {
  datepicker.nextMonth()
  rerenderMonthPanel()
})