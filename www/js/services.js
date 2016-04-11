appWeather.factory('LocateFactory', function($http) {

    var localization = {
        city: 'Paris',
        country: 'FR',
        getCity: function() {
            return this.city;
        },
        getCountry: function() {
            return this.country;
        }
    }

    function onSuccess(Position) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+Position.coords.latitude+","+Position.coords.longitude;
        $http.get(url)
            .success(function(response){
                localization.city = response.results[0].address_components[2].short_name;
                localization.country = response.results[0].address_components[5].short_name;
                window.localStorage.setItem("AppWeatherCity", localization.city);
            });
    }

    function onError(error) {
        alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }

    navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 10000 });

    return localization;
})

.service('CurrentWeatherService', function($http, $q) {
        this.weather = false;

        this.getWeather = function(queryCity) {
            var deferred = $q.defer();
            $http.get("http://api.openweathermap.org/data/2.5/weather?q="+queryCity+"&mode=json&units=metric&lang=fr&appid=87339c1e2bfc638b2ccf1f54938d2f7b")
                .success(function(data){
                    this.weather = data;
                    deferred.resolve(this.weather);
                })
                .error(function(){
                    deferred.reject("Impossible de recuperer les donnees");
                });
            return deferred.promise;
        }
    })

.service('ForecastService', function($http, $q) {
        this.forecast = false;

        this.getWeather = function(queryCity) {
            var deferred = $q.defer();
            $http.get("http://api.openweathermap.org/data/2.5/forecast/daily?q=" + queryCity + "&type=accurate&mode=json&units=metric&cnt=6&lang=fr&appid=87339c1e2bfc638b2ccf1f54938d2f7b")
                .success(function(data){
                    this.forecast = data;
                    deferred.resolve(this.forecast);
                })
                .error(function(){
                    deferred.reject("Impossible de recuperer les donnees");
                });
            return deferred.promise;
        }
    })