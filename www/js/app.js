document.addEventListener('Deviceready', function(){

}, false);

$( document ).ready(function() {
    
    var swiper = new Swiper('.swiper-container');

});

var appWeather = angular.module('weatherApp', ['ui.router', 'ngCordova', 'ngCordova.plugins']);

function toggleClass() {
    $("#weather").toggleClass("slide");
};