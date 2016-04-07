appWeather.controller('MainCtrl', function($scope) {
    $scope.date = new Date();
})
.controller('TodayCtrl', function($scope, $http, $window) {

        var getWeather = function(city) {
            url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&mode=json&units=metric&lang=fr&appid=87339c1e2bfc638b2ccf1f54938d2f7b";
            $http.get(url)
                .success(function(response){
                    $scope.cityname = response.name;
                    $scope.country = response.sys.country;
                    $scope.currenttemp = response.main.temp;
                    $scope.description = response.weather[0].description;
                    $scope.icon = response.weather[0].id;
                    $scope.windspeed = response.wind.speed;
                    windAngle = Math.round(response.wind.deg);
                    $scope.winddir = windAngle;
                    $('#windir-icon').css({transform: 'rotate(' + windAngle + 'deg)'});
                    $scope.humidity = response.main.humidity;
                    $scope.pressure = response.main.pressure;
                })
                .error(function(){
                    alert("Impossible de recuperer les donnees");
                });
        }

        $scope.search = function(){

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
            getWeather($scope.city);
        }

        $scope.searchByPosition = function() {
            $window.navigator.geolocation.getCurrentPosition(function(Position) {
                var currentLongitude = Position.coords.longitude;
                var currentLatitude = Position.coords.latitude;
                var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+currentLatitude+","+currentLongitude;
                $http.get(url)
                    .success(function(response){
                        var geoCity = response.results[0].address_components[2].short_name;
                        window.localStorage.setItem("AppWeatherCity", geoCity);
                        getWeather(geoCity);
                    });
            })
        }

        $scope.Math = Math;
        $scope.search();

        $scope.toggleClass = function() {
            $(".slider").toggleClass("slide"),
                $('#navbar').toggleClass('lighten');
        };

})


.controller('ForecastCtrl', function($scope, $http) {

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

    var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + $scope.city + "&type=accurate&mode=json&units=metric&cnt=6&lang=fr&appid=87339c1e2bfc638b2ccf1f54938d2f7b";
    $http.get(forecastUrl)
        .success(function (response) {
            $scope.cityname = response.city.name;
            $scope.country = response.city.country;
            $scope.forecast = response.list;
        });
});
