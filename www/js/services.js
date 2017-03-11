appWeather.service('LocationService', function($http, $q) {

    var _this = this;

    this.getCurrentLocation = function() {
        var deferred = $q.defer();

        navigator.geolocation.getCurrentPosition(function(position) {

            var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude;
            
            $http.get(url)
                .success(function(response){
                    location.city = response.results[0].address_components[2].short_name;
                    location.country = response.results[0].address_components[5].short_name;
                    location.lon = position.coords.longitude;
                    location.lat = position.coords.latitude;
                    deferred.resolve(location);
                })
                .error(function(error) {
                    deferred.reject('Impossible de récuperer les donnees');
                });
        }, function(error) {
            alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        }, { timeout: 10000 });

        return deferred.promise;
    };

    this.getDefaultLocation = function() {
        var location = {};
        location.city = 'Paris';
        location.country = 'FR';
        location.lon = '2.351828';
        location.lat = '48.856578';
        return location;
    }
})

.service('WeatherService', function($http, $q) {
    this.getWeatherFor = function(queryLocation, lang) {
        var deferred = $q.defer();
        $http.get('https://gregoryklein.io/ws/weather/current/' + lang + '/' + queryLocation.city)
            .success(function(data){
                this.weather = data;
                deferred.resolve(this.weather);
            })
            .error(function(){
                deferred.reject('Impossible de récuperer les donnees');
            });
        return deferred.promise;
    };

    this.getForecastFor = function(queryLocation, lang) {
        var deferred = $q.defer();
        $http.get('https://gregoryklein.io/ws/weather/forecast/' + lang + '/' + queryLocation.city)
            .success(function(data){
                this.weather = data;
                deferred.resolve(this.weather);
            })
            .error(function(){
                deferred.reject('Impossible de récuperer les donnees');
            });
        return deferred.promise;
    };
})

.service('CacheService', function() {
    this.store = function(key, val) {
        window.localStorage.setItem(key, val);
    };

    this.get = function(key) {
        return window.localStorage.getItem(key);
    };
});