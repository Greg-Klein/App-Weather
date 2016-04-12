appWeather.controller('MainCtrl', function($scope) {
    $scope.date = new Date();
})
.controller('TodayCtrl', function($scope, $http, $cordovaVibration, LocateFactory, CurrentWeatherService) {

        function getWeather(city) {
            $scope.loading = true;
            CurrentWeatherService.getWeather(city).then(function(weather){
                $scope.today = weather;
                $scope.loading = false;
                $cordovaVibration.vibrate(100);
                $('#windir-icon').css({transform: 'rotate(' + Math.round($scope.today.wind.deg) + 'deg)'});
            }, function(msg){
                alert(msg);
                $scope.loading = false;
            });
        }

        $scope.search = function(){

            var storedCity = window.localStorage.getItem("AppWeatherCity");

            if (typeof $scope.city != 'undefined'){
                window.localStorage.setItem("AppWeatherCity", $scope.city);
            } else {
                if(storedCity == null){
                    $scope.city = 'Paris';
                    window.localStorage.setItem("AppWeatherCity", $scope.city);
                } else {
                    $scope.city = storedCity;
                }
            }
            getWeather($scope.city);
        };

        $scope.searchByPosition = function() {
            getWeather(LocateFactory.getCity()+","+LocateFactory.getCountry());
        };

        $scope.toggleClass = function() {
            $(".slider").toggleClass("slide"),
                $('#navbar').toggleClass('lighten');
        };

        $scope.Math = Math;
        $scope.search();

})


.controller('ForecastCtrl', function($scope, $http, $timeout, ForecastService) {

    var localStorageCity = window.localStorage.getItem("AppWeatherCity");

    if (typeof $scope.city != 'undefined'){
        window.localStorage.setItem("AppWeatherCity", $scope.city);
    } else {
        if(localStorageCity == null){
            $scope.city = 'Paris';
            window.localStorage.setItem("AppWeatherCity", $scope.city);
        } else {
            $scope.city = localStorageCity;
        }
    }

    $scope.Math = Math;
    $scope.loading = true;
    $scope.forecast = ForecastService.getWeather($scope.city).then(function(weather){
        $scope.forecast = weather.list;
        $scope.loading = false;
    }, function(msg){
        alert(msg);
        $scope.loading = false;
    });

});