appWeather.controller('MainCtrl', function($scope) {
    $scope.date = new Date();
})
.controller('TodayCtrl', function($scope, $http, $cordovaVibration, LocateFactory, CurrentWeatherService) {

        function getWeather(city) {
            $scope.loading = true;
            CurrentWeatherService.getWeather(city).then(function(weather){
                $scope.today = weather;
                $scope.loading = false;
                var windspeed = Math.round(weather.wind.speed * 3.6);
                if(windspeed >= 90){
                	$('#windspeed-icon').css({color: 'red'});
                } else if(windspeed >= 60){
                	$('#windspeed-icon').css({color: 'orange'});
                }
                $('#windir-icon').css({transform: 'rotate(' + Math.round($scope.today.wind.deg) + 'deg)'});
            }, function(msg){
                $cordovaVibration.vibrate(100);
                alert(msg);
                $scope.loading = false;
            });
        }

        $scope.search = function(){

            if ($scope.city == undefined){
            	$scope.city = window.localStorage.getItem("AppWeatherCity") || 'Paris';
                window.localStorage.setItem("AppWeatherCity", $scope.city);
            } else {
            	window.localStorage.setItem("AppWeatherCity", $scope.city);
            }

            getWeather($scope.city);
        };

        $scope.searchByPosition = function() {
            getWeather(LocateFactory.getCity()+","+LocateFactory.getCountry());
        };

        $scope.Math = Math;
        $scope.search();

})


.controller('ForecastCtrl', function($scope, $http, $timeout, ForecastService) {

    $scope.search = function() {
        if ($scope.city == undefined){
            $scope.city = window.localStorage.getItem("AppWeatherCity") || 'Paris';
            window.localStorage.setItem("AppWeatherCity", $scope.city);
        } else {
            window.localStorage.setItem("AppWeatherCity", $scope.city);
        }

        $scope.Math = Math;
        $scope.loading = true;
        $scope.forecast = ForecastService.getWeather($scope.city).then(function(weather){
            $scope.forecast = weather.list;
            $scope.loading = false;
        }, function(msg){
            $cordovaVibration.vibrate(100);
            alert(msg);
            $scope.loading = false;
        });
    }

    $scope.search();

});