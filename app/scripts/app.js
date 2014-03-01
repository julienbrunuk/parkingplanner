'use strict';

angular.module('parkingplannerApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.map'
    ])

    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
function onGoogleReady() {
    angular.bootstrap(document.getElementById("ParkingApp"), ['parkingplannerApp']);
}