document.addEventListener('Deviceready', function(){

}, false);

$( document ).ready(function() {

});

angular.module('weatherApp', [])
	.controller('WeatherCtrl', function($scope, $http) {
         $scope.search = function(){

         	if (typeof $scope.city != 'undefined'){
         		localStorage.setItem("city", $scope.city);
         	} else {
         		$scope.city = 'Paris, Fr';
				localStorage.setItem("city", $scope.city);
         	}
         	        	
         	var dayUrl = "http://api.openweathermap.org/data/2.5/weather?q="+$scope.city+"&mode=json&units=metric&lang=fr&appid=87339c1e2bfc638b2ccf1f54938d2f7b";
         	var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+$scope.city+"&type=accurate&mode=json&units=metric&cnt=6&lang=fr&appid=87339c1e2bfc638b2ccf1f54938d2f7b";
         	$http.get(dayUrl)
				.success(function(response){
					$scope.currenttemp = response.main.temp;
					$scope.description = response.weather[0].description;
					$scope.icon = response.weather[0].id;
					$scope.windspeed = response.wind.speed;
					windAngle = Math.round(response.wind.deg);
					$scope.winddir = windAngle;
					$('#windir-icon').css({transform: 'rotate(' + windAngle + 'deg)'});
				})
				.error(HttpFail);



         	$http.get(forecastUrl)
				.success(function(response){
					$scope.date = new Date();
					$scope.cityname = response.city.name;
					$scope.country = response.city.country;

					$scope.day0 = response.list[0];
					$scope.day1 = response.list[1];
					$scope.day2 = response.list[2];
					$scope.day3 = response.list[3];
					$scope.day4 = response.list[4];
					$scope.day5 = response.list[5];
				});
         }

         HttpFail = function(){
         	alert("Impossible de recuperer les donnees");
         }

         $scope.Math = Math;
         $scope.city = localStorage.city;
         $scope.search();

         $scope.toggleClass = function() {
		 	$(".slider").toggleClass("slide"),
         $('#navbar').toggleClass('lighten');
		 };
    });