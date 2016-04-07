appWeather.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/today");
    $stateProvider
        .state('today', {
            url: "/today",
            templateUrl: "today.html",
            controller: "TodayCtrl"
        })
        .state('forecast', {
            url: "/forecast",
            templateUrl: "forecast.html",
            controller: "ForecastCtrl"
        })
}]);