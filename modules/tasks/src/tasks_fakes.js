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
        .factory('lsTaskFakeFactory', appointmentsService);

    appointmentsService.$inject = ['$timeout', '$q', 'lsTaskModel', 'lsDateService'];

    function appointmentsService($timeout, $q, lsTaskModel, lsDateService) {
        var _service = {
                getAppointmentTasks: getApppointmentTasks,
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

        function getApppointmentTasks(id) {
            return fakeAppointmentTasks(id)
                .then(success)
                .then(addToCache);

            function success(data) {
                return lsTaskModel.createArrayFromApi(data, _updateMethods);
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
                _task = lsTaskModel.create(appointmentId, _date, _by, description, _updateMethods);

            $timeout(function() {
                _task.id = chance.guid();
                deferred.resolve(_task);
            }, delay());
            return deferred.promise;
        }

        function markCompleteAsync(task) {
            var deferred = $q.defer(),
                _date = lsDateService.now(),
                // get from user service
                _by = 'Todd B. Adams';
            task.status = 'updating task as completed';
            $timeout(function() {
                task.setComplete(_date, _by);
                deferred.resolve();
            }, delay());
            return deferred.promise;
        }

        function markIncompleteAsync(task) {
            var deferred = $q.defer();
            $timeout(function() {
                task.setIncomplete();
                deferred.resolve();
            }, delay());
            return deferred.promise;
        }

        function updateNoteAsync(task) {
            var deferred = $q.defer();
            $timeout(function() {
                task.setNote();
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

        function colorRedAsync(task) {
            return colorAsync(task, 'red');
        }

        function colorGreenAsync(task) {
            return colorAsync(task, 'green');
        }

        function colorBlueAsync(task) {
            return colorAsync(task, 'blue');
        }

        function colorAsync(task, color) {
            var deferred = $q.defer();
            $timeout(function() {
                if (task.color === 'ls-background-' + color) {
                    color = 'white';
                }
                task.setColor(color);
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

        function fakeAppointmentTasks(id) {
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
