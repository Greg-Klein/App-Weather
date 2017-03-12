function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["(N)", "(NNE)", "(NE)", "(ENE)", "(E)", "(ESE)", "(SE)", "(SSE)", "(S)", "(SSW)", "(SW)", "(WSW)", "(W)", "(WNW)", "(NW)", "(NNW)"];
    return arr[(val % 16)] || "";
}

function getLang() {
    return navigator.language.substring(0, 2).toLowerCase() || 'en';
}

function getWindIconColor(windSpeed) {
    var color = 'inherit';
    if(windSpeed >= 40) {
        iconColor = 'orange';
    } else if(windSpeed >= 80) {
        iconColor = 'red';
    }

    return color;
}

function DayWeather(date) {
    this.date = moment(date).format('ddd L');
    this.description = '';
    this.iconId = '';
    this.temp = {
        current: '',
        max: '',
        min: ''
    };
    this.wind = {
        speed: '',
        direction: ''
    };
    this.pressure = '';
    this.humidity = '';
}

appWeather.controller('MainCtrl', function($scope, $cordovaVibration, LocationService, WeatherService, CacheService) {
    $scope.appLang = CacheService.get('lang') || getLang();
    CacheService.store('lang', $scope.appLang);
    moment.locale($scope.appLang);
    $scope.todayDate = moment().format('LL');

    var storedLocation = JSON.parse(CacheService.get('location'));

    $scope.bookmarks = JSON.parse(CacheService.get('bookmarks'));

    $scope.bookmarks = [
        {
            city: 'Toulouse'
        },
        {
            city: 'Paris'
        },
        {
            city: 'Montauban'
        }
    ]

    $scope.deleteBookmark = function(i) {
        $scope.bookmarks.splice(i, 1);
    };
    
    $scope.location =  storedLocation ? storedLocation : LocationService.getDefaultLocation();

    $scope.getLocalWeather = function() {
        LocationService.getCurrentLocation().then(function(location) {
            $scope.location = location || LocationService.getDefaultLocation();
            CacheService.store('location', JSON.stringify($scope.location));
            $scope.queryWeather();
            $scope.queryForecast();
        });
    };

    $scope.queryWeather = function() {
        WeatherService.getWeatherFor($scope.location, $scope.appLang)
        .then(function(data) {
            var day = new DayWeather(new Date());
            var windSpeed = Math.round(data.wind.speed * 3.6);
            var iconColor = getWindIconColor(windSpeed);

            day.temp.current = Math.round(data.main.temp);
            day.iconId = data.weather[0].id;
            day.description = data.weather[0].description;
            day.wind.speed = windSpeed;
            day.wind.direction = Math.round(data.wind.deg);
            day.wind.directionStr = degToCompass(data.wind.deg);
            day.wind.iconAngle = 'rotate(' + day.wind.direction + 'deg)';
            day.wind.iconColor = iconColor;
            day.pressure = data.main.pressure;
            day.humidity = data.main.humidity;

            $scope.w = day;
            $scope.isLoading = false;
            $scope.$parent.animTrigger = true;
        }, function(msg){
            $cordovaVibration.vibrate(100);
            alert(msg);
            $scope.isLoading = false;
        });
    };

    $scope.queryForecast = function() {
        WeatherService.getForecastFor($scope.location, $scope.appLang)
        .then(function(data) {
            var days = [];
            data.list.forEach(function(item) {
                var date = new Date(item.dt * 1000);
                if(moment(date).isAfter(moment(), 'day')) {
                    var day = new DayWeather(new Date(item.dt * 1000));
                    var windSpeed = Math.round(item.speed * 3.6);
                    var iconColor = getWindIconColor(windSpeed);

                    day.temp.min = Math.round(item.temp.min);
                    day.temp.max = Math.round(item.temp.max);
                    day.description = item.weather[0].description;
                    day.iconId = item.weather[0].id;
                    day.wind.speed = windSpeed;
                    day.wind.direction = Math.round(item.deg);
                    day.wind.directionStr = degToCompass(item.deg);
                    day.wind.iconAngle = 'rotate(' + day.wind.direction + 'deg)';
                    day.wind.iconColor = iconColor;

                    days.push(day);
                } else if(moment(date).isSame(moment(), 'day')) {
                    $scope.$parent.todayMinTemp = Math.round(item.temp.min);
                    $scope.$parent.todayMaxTemp = Math.round(item.temp.max);
                }
            });

            $scope.dayList = days;

            $scope.isLoading = false;
        }, function(msg){
            $cordovaVibration.vibrate(100);
            alert(msg);
            $scope.isLoading = false;
        });
    };
    
})

.controller('TodayCtrl', function($scope) {
    $scope.isLoading = true;
    $scope.$parent.queryWeather();
})

.controller('ForecastCtrl', function($scope) {
    $scope.isLoading = true;
    $scope.$parent.queryForecast();    
});