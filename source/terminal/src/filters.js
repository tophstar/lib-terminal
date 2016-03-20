(function () {
  var Filters = function (module) {
    module.filter(Filters.TotalTimeDisplay.NAME, Filters.TotalTimeDisplay);
  };

  define([
//    "./filters/some_filter",
  ], function (
    //SomeFilter
    ) {
    //Filters.SomeFilter = SomeFilter;
    return Filters;
  });
}());