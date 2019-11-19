var expect = require('chai').expect
var DatepickerScript = require('../lib/Datepicker.cjs').DatepickerScript

it('Should instantiate new DatepickerScript object', function() {
  expect(new DatepickerScript()).to.be.an.instanceOf(DatepickerScript)
})

it('Datepicker data prop should return 42 entries after computePanel method', function() {
  var datepickerInstance = new DatepickerScript()
  datepickerInstance.computePanel()

  var currentData = datepickerInstance.data

  expect(currentData.length).to.equal(42)
})

it('Datepicker data prop should return 42 entries after computePanel method', function() {
  var datepickerInstance = new DatepickerScript()
  datepickerInstance.computePanel()

  var currentData = datepickerInstance.data

  expect(currentData.length).to.equal(42)
})