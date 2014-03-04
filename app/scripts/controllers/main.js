'use strict';

angular.module('parkingplannerApp')

    .config(function ($httpProvider) {
        // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })

    .controller('MainCtrl', function ($scope, myService, $http) {
        // Useful variables
        var APIRestUrl = 'http://parkingplanner.apiary.io/v1/' // NEED TO BE CHANGED JABRY
        $scope.mapOptions = {
            center: new google.maps.LatLng(51.5008, -0.0247),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.myParkingZoneMarkers = [];
        $scope.myParkingBayMarkers = [];


        $scope.getNewData = function () {
            var result = { status: "Initialized." };
            $scope.result = result;
            myService.getData().then(function (data) {
                $scope.result = data;
            });
        };

        $scope.createCustomtGooglemapsUI = function ($event, $params) {
            var controlDiv = document.createElement('div');
            controlDiv.style.padding = '5px';

            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = 'white';
            controlUI.style.borderStyle = 'solid';
            controlUI.style.borderWidth = '2px';
            controlUI.style.cursor = 'pointer';
            controlUI.style.textAlign = 'center';
            controlUI.title = 'Click to set the map to Home';
            controlDiv.appendChild(controlUI);

            google.maps.event.addDomListener(controlUI, 'click', function () {
                var test = getParkingZones($scope.myMap, $scope.myParkingZoneMarkers);


            });



            var controlText = document.createElement('div');
            controlText.style.fontFamily = 'Arial,sans-serif';
            controlText.style.fontSize = '12px';
            controlText.style.paddingLeft = '4px';
            controlText.style.paddingRight = '4px';
            controlText.innerHTML = '<strong>Get Parking Zones</strong>';
            controlUI.appendChild(controlText);

            $scope.myMap.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);

        }
        var UICreated = 0;
        $scope.onMapIdle = function() {
            if(UICreated == 0){
                $scope.createCustomtGooglemapsUI();
                UICreated++;

            }
        };

        var getParkingZones = function (map) {

            var bounds = map.getBounds();
            var southWest = bounds.getSouthWest();
            var northEast = bounds.getNorthEast();
            var minLat = southWest.lat();
            var maxLat = northEast.lat();
            var minLon = southWest.lng();
            var maxLon = northEast.lng();

            var url = APIRestUrl + 'parkingzone?' + minLat + '/' + minLon + '/' + maxLat + '/' + maxLon ;
            console.log(url);
            var data = $http.get(url).then(function (result) {
                data = result.data;
                for (var i = 0; i < data.length; i++) {

                    var latLgn = {d: data[i].latitude, e: data[i].longitude};

                    var myLatlng = new google.maps.LatLng(parseFloat(data[i].latitude),parseFloat(data[i].longitude));

                    $scope.myParkingZoneMarkers.push(new google.maps.Marker({
                        map: map,
                        position: myLatlng

                    }));

                }
            });

        };

        var getParkingBays = function (map) {

            var bounds = map.getBounds();
            var southWest = bounds.getSouthWest();
            var northEast = bounds.getNorthEast();
            var minLat = southWest.lat();
            var maxLat = northEast.lat();
            var minLon = southWest.lng();
            var maxLon = northEast.lng();

            var url = APIRestUrl + 'parkingzone?' + minLat + '/' + minLon + '/' + maxLat + '/' + maxLon ; // NEED TO BE CHANGED JABRY
            console.log(url);
            var data = $http.get(url).then(function (result) {
                data = result.data;
                for (var i = 0; i < data.length; i++) {

                    var latLgn = {d: data[i].latitude, e: data[i].longitude};

                    var myLatlng = new google.maps.LatLng(parseFloat(data[i].latitude),parseFloat(data[i].longitude));

                    $scope.myParkingBayMarkers.push(new google.maps.Marker({
                        map: map,
                        position: myLatlng

                    }));

                }
            });

        };

        $scope.getServerData = function () {

            drawCircles($scope.myMap);
        };

        $scope.getParkingZones = getParkingZones;




        var beaches = [
            ['Bondi Beach', -33.890542, 151.274856, 4],
            ['Coogee Beach', -33.923036, 151.259052, 5],
            ['Cronulla Beach', -34.028249, 151.157507, 3],
            ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
            ['Maroubra Beach', -33.950198, 151.259302, 1]
        ];

        function initMap(map, locations) {
            // Add markers to the map

            // Marker sizes are expressed as a Size of X,Y
            // where the origin of the image (0,0) is located
            // in the top left of the image.

            // Origins, anchor positions and coordinates of the marker
            // increase in the X direction to the right and in
            // the Y direction down.
            var image = {
                url: 'images/yeoman.png',

                // This marker is 20 pixels wide by 32 pixels tall.
                size: new google.maps.Size(20, 32),
                // The origin for this image is 0,0.
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at 0,32.
                anchor: new google.maps.Point(0, 32)
            };
            // Shapes define the clickable region of the icon.
            // The type defines an HTML &lt;area&gt; element 'poly' which
            // traces out a polygon as a series of X,Y points. The final
            // coordinate closes the poly by connecting to the first
            // coordinate.
            var shape = {
                coord: [1, 1, 1, 20, 18, 20, 18 , 1],
                type: 'poly'
            };
            for (var i = 0; i < locations.length; i++) {
                var beach = locations[i];
                var myLatLng = new google.maps.LatLng(beach[1], beach[2]);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    shape: shape,
                    title: beach[0],
                    zIndex: beach[3]
                });
            }
        }


    })

    .service("myService", function ($q, $timeout) {
        return {
            getData: function () {
                var deferral = $q.defer();
                $timeout(function () {
                    deferral.resolve({
                        id: 1,
                        status: "Returned from service.",
                        promiseComplete: true });
                }, 2000);
                return deferral.promise;
            }
        };
    });