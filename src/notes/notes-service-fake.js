(function(angular, chance) {
    'use strict';

    /**
     * @ngdoc service
     * @name lsAppointmentsService
     * @module ls
     *
     * @description
     * Web api interface for appointments.
     *
     */
    angular.module('ls')
        .factory('lsNotesService', appointmentsService);

    appointmentsService.$inject = ['$timeout', '$q', 'lsNoteModel', 'lsDateService'];

    function appointmentsService($timeout, $q, lsNoteModel, lsDateService) {
        var _service = {
                getAppointmentNotes: getApppointmentNotes,
                addAsync: addAsync
            },
            _updateMethods = {
                markCompleteAsync: markCompleteAsync,
                markIncompleteAsync: markIncompleteAsync,
                updateNoteAsync: updateNoteAsync,
                deleteAsync: deleteAsync,
                colorRedAsync: colorRedAsync,
                colorGreenAsync: colorGreenAsync,
                colorBlueAsync: colorBlueAsync
            },
            _note = '512 chacter notoe. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend accumsan nulla, quis tincidunt urna ullamcorper et. Nulla nec nulla lacus. Sed sem nibh, finibus interdum vulputate eu, molestie non purus. Interdums et malesuada fames ac antedolor est,  ipsum primis in faucibus. Nunc varius rutrum euismod. Integer dignissim, ipsum vel lacinia placerat, tortor enim imperdiet velit, eu feugiat eu feugiat leo lectus et arcu. Morbi dolor est, porttitor nec neque quis, ultricies rutrums.';

        function getApppointmentNotes(id) {
            return fakeAppointmentNotes(id)
                .then(success)
                .then(addToCache);

            function success(data) {
                return lsNoteModel.createArrayFromApi(data, _updateMethods);
            }

            function addToCache(modelArray) {
                // todo: lsCache.addAppointments(modelArray);
                return modelArray;
            }
        }

        function addAsync(appointmentId, description) {
            var deferred = $q.defer(),
                _date = lsDateService.now(),
                // get from user service
                _by = 'Todd B. Adams',
                _note = lsNoteModel.create(appointmentId, _date, _by, description, _updateMethods);

            $timeout(function() {
                deferred.resolve(_note);
            }, delay());
            return deferred.promise;
        }

        function markCompleteAsync(note) {
            var deferred = $q.defer(),
                _date = lsDateService.now(),
                // get from user service
                _by = 'Todd B. Adams';
            note.status = 'updating note as completed';
            $timeout(function() {
                note.setComplete(_date, _by);
                deferred.resolve();
            }, delay());
            return deferred.promise;
        }

        function markIncompleteAsync(note) {
            var deferred = $q.defer();
            $timeout(function() {
                note.setIncomplete();
                deferred.resolve();
            }, delay());
            return deferred.promise;
        }

        function updateNoteAsync(note) {
            var deferred = $q.defer();
            $timeout(function() {
                note.setNote();
                deferred.resolve();
            }, delay());
            return deferred.promise;
        }

        function deleteAsync(id) {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve();
            }, delay());
            return deferred.promise;
        }

        function colorRedAsync(note) {
            return colorAsync(note, 'red');
        }

        function colorGreenAsync(note) {
            return colorAsync(note, 'green');
        }

        function colorBlueAsync(note) {
            return colorAsync(note, 'blue');
        }

        function colorAsync(note, color) {
            var deferred = $q.defer();
            $timeout(function() {
                if (note.color === 'ls-background-' + color) {
                    color = 'white';
                }
                note.setColor(color);
                deferred.resolve();
            }, delay());
            return deferred.promise;
        }


        function delay() {
            return chance.integer({
                min: 220,
                max: 1200
            });
        }

        function fakeAppointmentNotes(id) {
            var _i, _l = chance.integer({
                    min: 2,
                    max: 10
                }),
                _results = [];
            for (_i = 0; _i < _l; _i += 1) {
                _results.push({
                    id: chance.guid(),
                    appointmentId: id,
                    note: _note,
                    entered: moment().add(chance.integer({
                        min: -22,
                        max: -1
                    }), 'day').unix(),
                    enteredBy: chance.name()
                });
            }
            return asPromise(_results);
        }

        function asPromise(item) {
            var _q = $q.defer();
            _q.resolve(item);
            return _q.promise;
        }

        return _service;
    }

})(angular, chance);
