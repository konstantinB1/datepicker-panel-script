# renderless-datepicker-script

Datepicker functionality without the UI. Unopinionated about style, it provides minimal interface for creating flexibile, and customizable datepicker funcionality for authors to stylize their datepicker as they wish. 

Why? Because every datepicker out there ships with their default styles or templates which can somethimes be a real hassle to customize, and often you need to fork it yourself or hack css with dozens of ``!important`` css statements. 

So the rendering is up to you.

## Getting started

`npm i renderless-datepicker-script --save`


### DatepickerScript class

Datepicker class is only export from the package. It provides few methods and arguments in constructor.


##### Public methods


```javascript
.computePanel(year: number, month: number) : datepickerScriptInstance
```

If arguments are ommited it sets current year and month and renders exactly 42 days, along with previous, and next months

___

```javascript
.nextMonth(year: number, month: number) : datepickerScriptInstance
```

Sets automaticly the next month as current. It calls ``computePanel`` internaly so all it does it increments the month by 1.

___

```javascript
.prevMonth(year: number, month: number) : Array
```

Sets automaticly the next month as current. It calls ``computePanel`` internaly so all it does it decrements the month by 1.

___

```javascript
.formatMatrixGrid() : datepickerScriptInstance
```

Utility method that formats the data array with matrix 6x7 rows for easier rendering

##### Public properties

```javascript
getData : Array
```

Gets datepicker data

___

```javascript
getCurrentDate : Date
```

Gets current date

## Example

```javascript

import DatepickerScript from 'renderless-datepicker-script'

class MyDatepickerExample {
  constructor () {
    this.datepickerScript = new DatepickerScript({
      listener: this.dayClickListener
    })

    this.render()
  }

  // All elements from DatepickerDayScript that
  // were added by `.addToListener` method when clicked
  // will call this method
  dayClickListener ({ date }) {
    /* Handle day click callback */
  }

  // User defined render method
  render () {
    const datepicker = this.datepickerScript

    // DOM rendered table rows
    const dpBody = document.querySelectorAll('.datepicker-body tr')

    // Format the grid
    const data = datepicker.formatMatrixGrid()
  
    // Loop through grid and render elements from array
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const getRowTr = dpBody[i]
      
      if (getRowTr) {
        const getCells = getRowTr.querySelectorAll('td')
  
        for (let x = 0; x < getCells.length; x++) {
          const cell = getCells[x]

          // Each row in the array returns DatepickerScriptDay
          // class
          const dayInstance = row[x]

          // DatepickerScriptDay has a method .addToListener
          // that add all rendered dom qualified elements
          // to a listener that is registered in 
          // DatepickerScript options as prop `listener`
          // It serve as click callback for all clicked
          // DatepickerScriptDay instances
          dayInstance.addToListener(cell)

          // Get the date prop for that particular day
          const dateProp = dayInstance.date

          // Render
          cell.innerHTML = moment(dateProp).format('DD')
        }
      }
    } 
  }
}

new MyDatepickerExample()
```
