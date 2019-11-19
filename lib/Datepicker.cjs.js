"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatepickerScriptUtils = exports.DatepickerScript = exports.DatepickerScriptDay = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DatepickerScript =
/*#__PURE__*/
function () {
  /**
   * DatepickerScript constructor
   * 
   * @param {Object} dateObj 
   */
  function DatepickerScript() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, DatepickerScript);

    this._date = null;
    this.data = [];
    this.listener = options.listener || undefined;
    this.utilsClass = options.utilsClass || DatepickerScriptUtils;
    this._utilInternal = new DatepickerScriptUtils();
    var dayCl = options.dayClass;

    if (dayCl) {
      if (!DatepickerScriptDay.isPrototypeOf(dayCl)) {
        var clName = dayCl.name;
        console.warn("[".concat(clName, "] class needs to extend DatepickerScriptDay. dayClass will default to DatepickerScriptDay class!"));
        this.dayClass = DatepickerScriptDay;
      } else {
        this.dayClass = dayCl;
      }
    } else {
      this.dayClass = DatepickerScriptDay;
    }

    this.setDate = options.date || null;
  }
  /**
   * Gets full year
   */


  _createClass(DatepickerScript, [{
    key: "nextMonth",

    /**
     * Gets next month relative to the last date object
     * 
     * @param {Number} m 
     * @param {Number} y
     * @return {DatepickerScript}
     */
    value: function nextMonth() {
      var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getMonth + 1;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getFullYear;
      this.setDate = {
        year: y,
        month: m,
        day: 1
      };
      this.computePanel(m, y);
      return this;
    }
    /**
     * Gets previous month relative to the last date object
     * 
     * @param {Number} m 
     * @param {Number} y 
     * @return {DatepickerScrip}
     */

  }, {
    key: "prevMonth",
    value: function prevMonth() {
      var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getMonth - 1;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getFullYear;
      this.setDate = {
        year: y,
        month: m,
        day: 1
      };
      this.computePanel(m, y);
      return this;
    }
    /**
     * Sets new day instance
     * 
     * @param  {Number} m 
     * @param  {Number} d 
     * @return {DatepickerScriptDay}
     */

  }, {
    key: "setDayInstanceItem",
    value: function setDayInstanceItem(m, d) {
      var utcDayDate = new Date(Date.UTC(this.getFullYear, m, d));
      return new this.dayClass(utcDayDate, this.listener, new this.utilsClass(utcDayDate));
    }
    /**
     * Removes listeners from day instance, and clears all data
     */

  }, {
    key: "clear",
    value: function clear() {
      var _this = this;

      this.data.forEach(function (dInst) {
        if (dInst && _instanceof(dInst, _this.dayClass) && dInst._listener) {
          dInst.removeListener();
        }
      });
      this.data = [];
    }
    /**
     * Creates new date panel
     * 
     * @param {Number} month 
     * @param {Number} year 
     */

  }, {
    key: "computePanel",
    value: function computePanel() {
      var month = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getMonth;
      var year = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getFullYear;
      this.clear();
      var _this$_utilInternal = this._utilInternal,
          getMonthDays = _this$_utilInternal.getMonthDays,
          getEnumDays = _this$_utilInternal.getEnumDays,
          getDayStrName = _this$_utilInternal.getDayStrName;
      var getUTCFirstInMonth = new Date(Date.UTC(year, month, 1));
      var monthsDays = getMonthDays(this._date);
      var getDayStringName = getDayStrName(getUTCFirstInMonth);

      if (getDayStringName !== 'mon') {
        var minDays = getEnumDays(getDayStringName);
        var getDaysInMonthBefore = this.getMonth === 0 ? monthsDays[11] : monthsDays[month - 1];
        var len = getDaysInMonthBefore - minDays;

        for (var i = getDaysInMonthBefore; i > len; i--) {
          this.data.unshift(this.setDayInstanceItem(month - 1, i));
        }
      }

      var curMonth = monthsDays[month];

      for (var _i = 1; _i <= curMonth; _i++) {
        this.data.push(this.setDayInstanceItem(month, _i));
      }

      var curPanelLen = this.data.length;
      var DATE_MATRIX_CALC = 42;
      var getRemaingingDiff = DATE_MATRIX_CALC - curPanelLen;

      for (var _i2 = 1; _i2 <= getRemaingingDiff; _i2++) {
        this.data.push(this.setDayInstanceItem(month + 1, _i2));
      }

      return this;
    }
    /**
     * Formats data for easier UI integration. Format is 6x7
     */

  }, {
    key: "formatMatrixGrid",
    value: function formatMatrixGrid() {
      var format = [[], [], [], [], [], [], []];
      var len = this.data.length;

      for (var i = 0, r = 0; i < len; i++) {
        var row = format[r];
        var rLen = row.length;
        var item = this.data[i];

        if (rLen === 6) {
          row.push(item);
          r++;
          continue;
        }

        row.push(item);
      }

      return format;
    }
  }, {
    key: "getFullYear",
    get: function get() {
      return this._date && _instanceof(this._date, Date) && this._date.getFullYear();
    }
    /**
     * Get month number
     */

  }, {
    key: "getMonth",
    get: function get() {
      return this._date && _instanceof(this._date, Date) && this._date.getMonth();
    }
    /**
     * Sets new date object
     * 
     * @param {Object} dateObject
     */

  }, {
    key: "setDate",
    set: function set() {
      var dateObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!dateObj) {
        this._date = new Date();
        return;
      }

      var year = dateObj.year,
          month = dateObj.month,
          day = dateObj.day;
      this._date = new Date(year, month, day);
    }
  }]);

  return DatepickerScript;
}();

exports.DatepickerScript = DatepickerScript;

var DatepickerScriptDay =
/*#__PURE__*/
function () {
  /**
   * DatepickerPanelScriptDay constructor
   * 
   * @param {Date}     dateObj 
   * @param {Function} listener
   * @param {DatepickerUtils|Object}
   */
  function DatepickerScriptDay() {
    var dateObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var listener = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return {};
    };
    var utils = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, DatepickerScriptDay);

    this.date = dateObj;
    this._listener = listener;
    this.el = null;
    this._bindedLst = null;
    this.utils = utils;
  }
  /**
   * Listener callback fn
   * 
   * @param {MouseEvent} e 
   */


  _createClass(DatepickerScriptDay, [{
    key: "_listenerFn",
    value: function _listenerFn(e) {
      this._listener(this, e);
    }
    /**
     * Adds element to single callback fn
     * 
     * @param {HTMLElement} el 
     */

  }, {
    key: "addToListener",
    value: function addToListener(el) {
      this.el = el;
      this._bindedLst = this._listenerFn.bind(this);

      if (this._listener && typeof this._listener === 'function') {
        this.el.addEventListener('click', this._bindedLst, true);
      }
    }
    /**
     * Removes element from callback, triggered on panel change
     */

  }, {
    key: "removeListener",
    value: function removeListener() {
      if (this.el && this._listener && this._bindedLst) {
        this.el.removeEventListener('click', this._bindedLst, true);
      }
    }
  }]);

  return DatepickerScriptDay;
}();

exports.DatepickerScriptDay = DatepickerScriptDay;

var DatepickerScriptUtils =
/*#__PURE__*/
function () {
  function DatepickerScriptUtils(date) {
    _classCallCheck(this, DatepickerScriptUtils);

    this.date = date;
  }
  /**
   * Get enum list of days
   * 
   * @param {Object}
   */


  _createClass(DatepickerScriptUtils, [{
    key: "getEnumDays",
    value: function getEnumDays(day) {
      var days = {
        'mon': 0,
        'tue': 1,
        'wed': 2,
        'thu': 3,
        'fri': 4,
        'sat': 5,
        'sun': 6
      };

      if (day in days) {
        return days[day];
      }

      return days;
    }
    /**
     * Get day string name
     * 
     * @param  {Date} date
     * @return {String}
     */

  }, {
    key: "getDayStrName",
    value: function getDayStrName(date) {
      var d = date || this.date;
      return d.toDateString().slice(0, 3).toLowerCase();
    }
    /**
     * Get day
     * 
     * @param {Date} date
     * @param {String}
     */

  }, {
    key: "getDay",
    value: function getDay(date) {
      var d = date || this.date;
      return d.toDateString().slice(8, 10);
    }
    /**
     * Get year
     * 
     * @param {Date} date
     * @param {Number}
     */

  }, {
    key: "getYear",
    value: function getYear(date) {
      var d = date || this.date;
      return d.getFullYear();
    }
    /**
     * Get month
     * 
     * @param {Date} date
     * @param {Number}
     */

  }, {
    key: "getMonth",
    value: function getMonth(date) {
      return date.getMonth();
    }
    /**
     * Get month days
     * 
     * @param {Number} year 
     * @param {Number} month
     * @param {Array|Number}
     */

  }, {
    key: "getMonthDays",
    value: function getMonthDays(date) {
      var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var d = date || this.date;
      var year = d.getFullYear();
      var feb = year % 4 === 0 ? 29 : 28;
      var months = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      if (month) {
        return months[month];
      }

      return months;
    }
    /**
     * Get is today
     * 
     * @param {Date} date
     * @param {Boolean}
     */

  }, {
    key: "isToday",
    value: function isToday(date) {
      var d = date || this.date;
      return d.toDateString() === new Date().toDateString();
    }
    /**
     * Get total elapsed days
     * 
     * @param  {Date} date
     * @return {Number}
     */

  }, {
    key: "getOffsetFromYearStartToToday",
    value: function getOffsetFromYearStartToToday(date) {
      var d = date || this.date;
      var allMonths = this.getMonthDays(d.getFullYear()).slice();
      var i = d.getMonth(),
          totalDays = 0;

      while (i--) {
        var curMonthDays = allMonths[i];
        totalDays += curMonthDays;
      }

      var today = this.getDay(d);
      return Math.floor(totalDays - today);
    }
  }]);

  return DatepickerScriptUtils;
}();

exports.DatepickerScriptUtils = DatepickerScriptUtils;