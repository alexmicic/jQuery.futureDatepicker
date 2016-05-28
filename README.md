# jQuery-Future-Datepicker
Simple jQuery plugin that allows you to create awesome datepicker for the future dates. 
Design is fully responsive and have clean and minimalist design and it is primarily built for the mobile devices. It's relaying on CSS ```flex``` so it is only compatible with modern web browser that supports this property.

## Dependencies
The plugin requires jQuery 2.xx version.

## Installation
To start using the plugin, simply include script code somewhere after jQuery library, preferably at the bottom of the page, like on the example below: 
```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <!-- your html code -->
    
    <!-- scripts -->
    <script src="~/jquery.{2.xx}.min.js"></script>
    <script src="~/jquery-calendar.js"></script>
  </body>
</html>
```

## Usage
After you included script into your page, you need to create an element that will initialize future datepicker and save the value of the chosen date. To do that, you can simply add an input element with unique ID and then add a plugin call, like on the example below:
```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <!-- your html code -->
    
    <!-- input field -->
    <input id="element" type="text" name="element" placeholder="Click here to pick a date">
    
    <!-- scripts  -->
    <script src="~/jquery.{2.xx}.min.js"></script>
    <script src="~/jquery-calendar.js"></script>
    <script>
        $(document).ready(function () {
            $('#element').futureDatepicker({
                displayWeekAbbr: true,
                startIn: 0,
                futureMonths: 12,
                datepicker: true,
                statusBar: true,
                showBgMonths: true,
                additionalClass: 'default',
                beforePick: function () { },
                afterPick: function () { }
            });
        });
    </script>

  </body>
</html>
```
###_element_
This needs to be an ```<input>``` element with ```type="text"``` or ```type="date"```.

###_options (defaults)_
* __displayWeekAbbr__ _[Boolean]_ : Format of the week day labels. It can be ```true``` - _Sat_ or ```false``` - _Saturday_.
* __startIn__ _[Integer]_: First day of the week. ```0``` - _Sunday_, ```1``` - _Monday_, _..._ , ```6``` - _Saturday_.
* __futureMonths__ _[Integer]_: Number of future months to show.
* __datepicker__ _[Boolean]_: Choose whether plugin should work as a datepicker or as a full page calendar. This feature is in progress and for now only datepicker should be used, or ```true``` value.
* __statusBar__ _[Boolean]_: Show ```true``` or hide ```false``` bottom status bar within the datepicker. If visible, then after the date is picked, _SET_ button needs to be clicked to save the value. If not visible value will be automatically saved by clicking on the date.
* __showBgMonths__ _[Boolean]_: Show ```true``` or hide ```false``` labels of the months, standing behind the days labels.
* __additionalClass__ _[String]_: Additional class can be added for optional ```CSS``` styling or ```JavaScript``` purpose.
* __beforePick__ _[Function]_: Code triggered before the date is selected.
* __afterPick__ _[Function]_: Code triggered after the date is selected.

## Licence
(The MIT License)

