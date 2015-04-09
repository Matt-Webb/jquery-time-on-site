      /**
       * Name: jQuery Counter Function
       * Creator: Matthew D Webb
       * Dependancies: jQuery / HTML5
       * DEMO: https://jsfiddle.net/Webby2014/ugug1vj1/
       */


;(function ($) {

          // Logic: seconds * minutes * hours * days * months (answer: 31,536,000);
          var SECONDS_IN_A_YEAR = 60 * 60 * 24 * 365;
          var running = true;

          $('.profit-counter').each(function () {

              var $this, profit, increment, currentIncrement, seconds, interval = 500;

              $this = $(this);

              profit = parseInt($this.data('profit'), 10);

              if (profit < 1 || isNaN(profit)) return;

              // most recent update added for handling varying interval settings:
              increment = (profit / SECONDS_IN_A_YEAR * (interval / 1000));
              currentIncrement = 0;
              seconds = 0;


              //---- for demo only ------------
              $('#secondsInYear').html('<li>' + numberWithCommas(SECONDS_IN_A_YEAR) + '</li>');
              $('#increment').append('<li>£' + numberWithCommas(increment.toFixed(2)) + '</li>');
              //---- end of demo ------------

              $this.html('£' + currentIncrement);

              setInterval(function () {

                  if (!running) return;

                  var total = currentIncrement += increment;

                  $this.html('£' + numberWithCommas(total.toFixed(2)));

                  //---- for demo only ------------
                  $('.counter').text(++seconds);
                  //---- end of demo ------------
                  
              }, interval);

          });

          function numberWithCommas(currentProfit) {

              var parts = currentProfit.toString().split(".");

              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

              return parts.join(".");
          }

          $('button').on('click', function () {

              var status = $(this).text();

              if (status === 'Pause') {
                  running = false;
                  $(this).text('Continue').addClass(' btn-success ').removeClass(' btn-warning ');
              } else {
                  running = true;
                  $(this).text('Pause').addClass(' btn-warning ').removeClass(' btn-success ');
              }
          });

})(jQuery);