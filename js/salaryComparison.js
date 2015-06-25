(function ($, undefined) {

    var WORKING_DAYS = 253; // http://www.work-day.co.uk/workingdays_holidays_2015.htm
    var TIME_ON_SITE = 0;

    $(function () {

        // initialise the time to track total time on site:
        setInterval(function () {
            TIME_ON_SITE += 1;
        }, 1000);

        $('#myCosts,#theirCosts,#myEarnings,#theirEarnings').hide();

        // handle default form submisson:
        $(document).on('submit', 'form.salary-form', function (event) {

            event.preventDefault();

            var userSalary = $(this).serializeArray()[0].value;
            var golferSalary = $('select option:selected', this).data('salary');

            calculate(userSalary, 'my', false);
            calculate(golferSalary, 'their', false);
            addGolfersName();

            // bespoke configurations ADD MORE HERE, please change ID:
            addTimeToTargetAmount(userSalary, golferSalary, '#golfersSalary');
            addTimeToTargetAmount(golferSalary, userSalary , '#userSalary');
            addTimeToTargetAmount(userSalary, 200000000 , '#gleneagles');
        });

        /**
         * Makes all nessarsary calls to calculate the salary (include breakdown) to be rendered
         * @param {string} salary
         * @param {string} whose
         * @param {boolean} delayCalc
         */
        var calculate = function (salary, whose, delayCalc) {

            var targetCosts = '#' + whose + 'Costs';
            var targetEarnings = '#' + whose + 'Earnings';

            if (salary) {

                salary = salary.toString().replace(/,/g, '');
                salary = parseInt(salary, 10);

                if (!isNaN(salary)) {

                    var data = salaryBreakdown(salary);

                    salary = parseFloat(parseInt(salary.toString().replace(/,/g, ''), 10));

                    $(targetCosts + ', ' + targetEarnings).show();

                    if (delayCalc) {

                        delayCalculation(function () {

                            renderResults(data, whose);
                            showEarnings(data, whose, 1000);

                        }, 500);

                    } else {
                        renderResults(data, whose);
                        showEarnings(data, whose, 1000);
                    }

                } else {
                    $(targetCosts + ', ' + targetEarnings).hide();
                }
            } else {
                $(targetCosts + ', ' + targetEarnings).hide();
            }
        };

        /**
         * Renders timer for incrementing the "on site" salary earnings
         * @param {array} data
         * @param {string} whose
         * @param {integer} interval
         */
        var showEarnings = function (data, whose, interval) {

            var target = '#' + whose + 'Earnings';

            setInterval(function () {

                $(target + '> p >' + '.earnings').each(function (index, value) {

                    $(this).html('');

                    var current = (data[0].secondRate * TIME_ON_SITE);

                    $(this).html('£' + currency(current.toFixed(2)));
                });

            }, interval);

        };

        /**
         * Renders html with calculated data
         * @param {array} data
         * @param {string} whose
         */
        var renderResults = function (data, whose) {

            var target = '#' + whose + 'Breakdown';

            $(target).html('');

            $(target).append('<h1>Break down</h1>',
                'Calculation for: <br/>',
                '<strong>£' + data[0].salary + '</strong><br />',
                'Day Rate: <br />',
                '£' + currency(data[0].dayRate.toFixed(2)) + '<br />',
                'Hourly Rate: <br />',
                '£' + currency(data[0].hourlyRate.toFixed(2)) + '<br />',
                'Minute Rate: <br />',
                '£' + currency(data[0].minRate.toFixed(2)) + '<br />',
                'Second Rate: <br />',
                '£' + currency(data[0].secondRate.toFixed(2)) + '<br />');

            // update costs:
            costCalc(data, whose);

            return false;
        };

        /**
         * Handles time for executing a calculation request
         * @param {function} 
         * @return {function} setTimeout
         */
        var delayCalculation = (function () {

            var timer = 0;

            return function (callback, ms) {

                clearTimeout(timer);

                timer = setTimeout(callback, ms);
            };

        })();

        /**
         * Converts integar into a formatted currency (adds commas)
         * @param {string} salary
         * @return {string} formatted string
         */
        var currency = function (salary) {

            salary = salary.toString().replace(/,/g, '');

            var parts = salary.toString().split(".");

            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            return parts.join(".");
        };

        /**
         * Breaks down salary into time period amountds
         * @param {string} salary 
         * @return {array} breakdown
         */
        var salaryBreakdown = function (salary) {

            var breakdown = [];

            var dayRate = parseFloat(salary / WORKING_DAYS);
            var hourlyRate = parseFloat((salary / WORKING_DAYS) / 8);
            var minRate = parseFloat(salary / WORKING_DAYS / (8 * 60));
            var secondRate = parseFloat(salary / WORKING_DAYS / (8 * 60 * 60));

            // update salary for "pretty currency":
            salary = parseFloat(salary).toFixed(2);

            breakdown.push({
                'salary': salary,
                    'dayRate': dayRate,
                    'hourlyRate': hourlyRate,
                    'minRate': minRate,
                    'secondRate': secondRate
            });

            return breakdown;
        };


        /**
         * Calculates costs based on an input time in seconds.
         * @param {array} data
         * @param {string} whose
         */
        function costCalc(data, whose) {

            var target = '#' + whose + 'Costs';

            $(target + '> p >' + '.cost[data-time]').each(function (index, value) {

                var timeInSeconds = parseInt($(this).data('time'), 10);

                if (timeInSeconds) {

                    var cost = currency(parseFloat(data[0].secondRate * timeInSeconds).toFixed(2));

                    $(this).html('£' + cost);
                }
            });
        }

        /**
         * Updates all html elements text with the class 'golfer' with the selected golfer.
         */
        var addGolfersName = function () {

            var golfer = $('select option:selected', 'form.salary-form').text();

            $('.golfer').each(function () {

                $(this).text(golfer);

            });
        };

        /**
         * Calculates a time durations for a given salary to a given amount, updating a given id.
         * @param {integer} salary
         * @param {integer} targetAmount
         * @return {string} elementId
         */
        var addTimeToTargetAmount = function (salary, targetAmount, elementId) {

            var time = '';

            var decimalYears = targetAmount / salary;
            var years = parseInt(decimalYears, 10);

            var decimalDays = (decimalYears - years) * WORKING_DAYS;
            var days = parseInt(decimalDays, 10);

            var decimalHours = (decimalDays - days) * 8;
            var hours = parseInt(decimalHours, 10);

            var decimalMins = (decimalHours - hours) * 60;
            var mins = parseInt(decimalMins, 10);

            var yearStr = " year ";
            var dayStr = " day ";
            var hourStr = " hour ";
            var minStr = " min ";

            if (years !== 1) {
                yearStr = " years ";
            }

            if (days !== 1) {
                dayStr = " days ";
            }

            if (hours !== 1) {
                hourStr = " hours ";
            }

            if (mins !== 1) {
                minStr = " mins ";
            }

            time = years + yearStr + days + dayStr + hours + hourStr + " and " + mins + minStr;

            $(elementId).text(time);         
        };

        /**
         * Full decimal rounding for more asthetic results
         * @param {integer} value
         * @param {integer} decimals
         * @return {number} Number
         */
        function round(value, decimals) {
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        }

    });

}(jQuery));
