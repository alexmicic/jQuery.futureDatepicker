(function ($) {
    $.futureDatepicker = function (options, element) {
        this.$el = $(element);
        this._init(options);
    };

    $.futureDatepicker.defaults = {
        //weeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        weekabbrs: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthabbrs: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        // choose between values in options.weeks or options.weekabbrs
        displayWeekAbbr: true,
        // choose between values in options.months or options.monthabbrs
        displayMonthAbbr: false,
        // left most day in the calendar
        // 0 - Sunday, 1 - Monday, ... , 6 - Saturday
        startIn: 0,
        // number of future months
        futureMonths: 12,
        // use as a datepicker
        datepicker: true,
        // status bar at the bottom
        statusBar: false,
        // show full month names in the background
        showBgMonths: true,
        // additional class
        additionalClass: '',
        // method: before date is picked
        beforePick: function () { return false; },
        // method: after date is picked
        afterPick: function () { return false; }
    }

    $.futureDatepicker.prototype = {
        _init: function (options) {
            // options
            this.options = $.extend(true, {}, $.futureDatepicker.defaults, options);
            
            this.today = new Date();
            //this.today = new Date('9/1/2016');
            this.month = (isNaN(this.options.month) || this.options.month == null) ? this.today.getMonth() : this.options.month - 1;
            this.year = (isNaN(this.options.year) || this.options.year == null) ? this.today.getFullYear() : this.options.year;
            // additional class for the container if exsist
            var additionalClass = this.options.additionalClass != '' ? this.options.additionalClass += ' ' : '';
            // additional class if the status bar is set to true
            if (this.options.statusBar)
                additionalClass += 'cal-status-bar ';
            // create calendar holder element
            this.$holder = $('<div class="cal-holder"></div>');

            // if needs to be visible only on click
            if (this.options.datepicker) {
                // add new class
                additionalClass += 'cal-click';
                // activate click event on the input box
                this._activate(this.$el);
                // at the end change this.$el to the body, so that new calendar be attached before the closing </body> tag
                this.$el = $('body');
            } else {
                // since this is not a datepicker, just generate a calendar template
                this._generateTemplate();
            }

            // add classes if there is any
            this.$holder.addClass(additionalClass)
        },
        _generateTemplate: function (activeClass) {
            var head = this._head(),
                body = this._body(),
                monthTitles = this.options.showBgMonths ? this._titles() : null,
                footer = this.options.statusBar ? this._footer() : null;
            // html container, append head section
            var container = $('<div class="cal-container">').append(head);
            // body container, append body and footer sections
            var bodyContent = $('<div class="cal-content">').append(body);
            // add month titles to the cal-content
            bodyContent.append(monthTitles);
            // add bodyContent to the cal-container
            container.append(bodyContent);
            // statusBar == true then
            // add footer to the cal-container
            if (this.options.statusBar)
                container.append(footer);
            // append everything to the main holder
            this.$holder.append(container);

            // not a datepicker, append this in the this.$el element
            this.$el.find('div.cal-holder').remove().end().append(this.$holder);

            // is a datepicker, add a small delay before adding a class '.active'
            if (typeof activeClass != undefined) {
                var self = this;
                setTimeout(function () {
                    (self.$holder).addClass(activeClass);
                }, 10);  
            }
        },
        _head: function () {
            // create holder for the week days
            var html = '<div class="cal-head">';
            // for each weekday create div
            for (var i = 0; i <= 6; i++) {
                var pos = i + this.options.startIn,
					j = pos > 6 ? pos - 6 - 1 : pos;

                html += '<div>';
                html += this.options.displayWeekAbbr ? this.options.weekabbrs[j] : this.options.weeks[j];
                html += '</div>';
            }
            html += '</div>';
            return html;
        },
        _body: function () {
            // create holder for the date cells
            var html = '<div class="cal-body">',
                elementClass;
            // for each month create cells and add appropriate class '.odd' or '.even' 
            for (var i = 1; i <= (this.options.futureMonths + 1) ; i++) {
                if ((i % 2) == 1) {
                    elementClass = 'odd';
                } else {
                    elementClass = 'even';
                }
                html += this._bodyMonth(i, elementClass);
            }
            html += '</div>';
            return html;
        },
        _bodyMonth: function (offset, elementClass) {
            var d = new Date(this.year, this.month + offset, 0),
				// number of days in the month
				monthLength = d.getDate(),
				firstDay = new Date(this.year, this.month + (offset - 1), 1),
                lastDay = new Date(this.year, this.month + (offset - 1), monthLength),
                monthName = this.options.monthabbrs[d.getMonth()];

            // day of the week
            this.startingDay = firstDay.getDay();
            this.endingDay = lastDay.getDay();

            var html = '';

            // position for the start date
            var posStart = this.startingDay - this.options.startIn,
                pStart = posStart < 0 ? 6 + posStart + 1 : posStart;

            // position for the end date
            /*var posEnd = this.options.startIn + this.endingDay + (this.startingDay - 1),
                pEnd = posEnd > 6 ? posEnd - 6 : posEnd;*/
            var posEnd = 6 - this.endingDay + this.options.startIn,
                pEnd = posEnd > 6 ? posEnd - 7 : posEnd;

            // offset for the first month add space before first month day
            if (offset == 1) {
                for (var k = 0; k < pStart; k++) {
                    html += '<div class="cal-day cal-disable ' + elementClass + '"></div>';
                }
            }

            // today's and disable class
            var todayClass,
                todayId,
                disableClass;

            // load days of the month
            for (var i = 1; i <= monthLength; i++) {
                // create date value
                var date = new Date(this.year, this.month + (offset - 1), i);
                var dateFormat = date.toLocaleDateString();

                // check if date is today
                if ( ((date.getDate()) == (this.today).getDate()) &&
                     ((date.getMonth()) == (this.today).getMonth()) && 
                     ((date.getFullYear()) == (this.today).getFullYear())) {
                    todayClass = ' cal-today active';
                    todayId = 'id="cal-today"';
                } else {
                    todayClass = '';
                    todayId = '';
                }

                // check if date is before today
                if (((date.getDate()) < (this.today).getDate()) &&
                     ((date.getMonth()) == (this.today).getMonth()) &&
                     ((date.getFullYear()) == (this.today).getFullYear())) {
                    disableClass = ' cal-disable';
                } else {
                    disableClass = '';
                }

                // add month name on the first and last div in the month
                if ((i == 1) || (i == monthLength)) {
                    html += '<div ' + todayId + ' class="cal-day ' + elementClass + todayClass + disableClass + '" data-value="' + dateFormat + '"><div class="cal-small-month">'
                        + monthName + '</div><span class="cal-inner">' + i + '</span></div>';
                } else {
                    html += '<div ' + todayId + ' class="cal-day ' + elementClass + todayClass + disableClass + '" data-value="' + dateFormat + '"><span class="cal-inner">' + i + '</span></div>';
                }                
            }

            // offset for the last month add space after last month day
            if (offset == (this.options.futureMonths + 1)) {
                for (var k = 0; k < pEnd; k++) {
                    html += '<div class="cal-day cal-disable ' + elementClass + '"></div>';
                }
            }

            return html;
        },
        _titles: function () {
            // calculate height for the months goes behind the dates
            // be aware that changing the height (line-height) of the date cells
            // will affect this layout, so manual adjustement is necessary
            var height = (this.options.futureMonths + 1) * 213;
            // create holder for month names
            var html = '<div class="cal-months" style="height:' + height + 'px">';
            // for each monht get name and add it to the holder
            for (var i = 1; i <= (this.options.futureMonths + 1) ; i++) {

                var d = new Date(this.year, this.month + i, 0),
                    monthName = this.options.months[d.getMonth()];

                html += '<div class="month">' + monthName + '</div>';
            }
            // return html
            html += '</div>';
            return html;
        },
        _footer: function () {
            var html = '<div class="cal-footer">';

            // create button 'Set'
            html += '<div><a href="#" class="cal-btn-set">Set</a></div>';

            // create button 'Cancel'
            html += '<div><a href="#" class="cal-btn-cancel">Cancel</a></div>';

            html += '</div>';
            return html;
        },
        _activate: function (el) {
            var self = this;
            // attach click event
            $(document).on('click', function (e) {
                // cache holder element
                var holder = self.$el.find(self.$holder);
                // clicked element
                var item = e.target;
                // check if the clicked element is input field
                if ($(item).is($(el))) {
                    // check if the holder is already appended to the DOM
                    // if yes just add '.active' class
                    if (holder.length > 0) {
                        holder.addClass('active');
                    // if not then generate template and attach click events
                    } else {
                        // generate template 
                        self._generateTemplate('active');
                        // TODO: scroll to today
                        // activate click events on the date for the datepicker and send the input element
                        self._attachClickEvents(el);
                    }
                // if clicked element is not input field
                } else {
                    // check if the click is on the calendar itself
                    // and if not remove '.active' class
                    if (!$(item).closest('.cal-container').length || $(item).closest('.cal-btn-cancel').length || $(item).closest('.cal-btn-set').length) {
                        if (holder.hasClass('active')) {
                            holder.removeClass('active');
                        }
                    }
                }
                return false;
            });
            // disable keyboard input
            $(el).attr('readonly', 'readonly');
        },
        _attachClickEvents: function (el) {
            var self = this;
            // select all days
            var days = self.$holder.find('.cal-day');
            // set the date value to today's date in case nothing is choosed, but 'SET' is clicked
            var date = self.today.toLocaleDateString();
            // for each day add click event
            days.each(function () {
                var item = $(this);
                var val = item.attr('data-value');
                item.on('click', function () {
                    // if item has class disable, meaning that is older than today
                    // then disable click event
                    if (item.hasClass('cal-disable')) {
                        item.off();
                    } else {
                        // check if there is beforePick defined
                        if (typeof self.options.beforePick === 'function') {
                            self.options.beforePick();
                        }

                        // attach '.active' class to the item
                        days.removeClass('active');
                        item.addClass('active');

                        // check if statusBar is visible
                        if (self.options.statusBar) {
                            date = val;
                        } else {
                            // remove '.active' class = hide calendar
                            self.$holder.removeClass('active');
                            // add value to the input box
                            $(el).val(val);
                        }

                        // check if there is afterPick defined
                        if (typeof self.options.afterPick === 'function') {
                            self.options.afterPick();
                        }
                    }
                    return false;
                });
            });

            // find set button
            var btnSet = self.$holder.find('.cal-btn-set');
            if (btnSet.length > 0) {
                btnSet.on('click', function () {
                    // remove '.active' class = hide calendar
                    self.$holder.removeClass('active');
                    // add value to the input box
                    $(el).val(date);
                });
            }
        }
        /************************
        **** PUBLIC METHODS *****
        *************************/

    };

    /************************
    **** GLOBAL VARIABLES *****
    *************************/

    $.fn.futureDatepicker = function (options) {
        var instance = $.data(this, 'futureDatepicker');
        this.each(function () {
            if (instance) {
                instance._init();
            }
            else {
                instance = $.data(this, 'futureDatepicker', new $.futureDatepicker(options, this));
            }
        });
        return instance;
    };
}(jQuery));