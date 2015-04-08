(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _serviceId = 'lsMap';

    /**
     * @ngdoc factory
     * @name lsMap
     * @module ls
     *
     * @description
     * Array utility functions
     *
     */
    angular.module(_moduleId)
        .factory(_serviceId, factory);

    factory.$inject = [];

    function factory() {
        var _service = {
            initialize: initialize
        };

        function initialize(domElement, lat, long, zoom, contact, address) {

            if (!google || !google.maps) return;

            var _latLong = new google.maps.LatLng(lat, long),
                _mapOptions = {
                    zoom: zoom,
                    center: _latLong
                },
                _map = new google.maps.Map(domElement, _mapOptions);

            _markerOptions = {
                    position: _latLong,
                    map: _map,
                    title: 'Hello World!'
                },
                _marker = new google.maps.Marker(_markerOptions);
            google.maps.event.addListener(_marker, 'click', function() {
                window.open("https://www.google.co.uk/maps/place/42%C2%B005'12.5%22N+71%C2%B023'49.4%22W/@42.086817,-71.397054,18z/data=!4m2!3m1!1s0x0:0x0");
            });

            return _map;
        }

        return _service;
    }
})(angular);
