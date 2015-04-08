(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name ls.directive:lsTasks
     * @restrict E
     *
     * @description
     * Displays and edits a set of tasks
     *
     */
    angular.module('ls.tasks.directives', [])
        .directive('lsTasks', tasksDirective);

    tasksDirective.$inject = ['lsTasksService'];

    function tasksDirective(lsTasksService) {
        return {
            restrict: 'A',
            scope: true,
            template: '<md-list>' +
                '<md-item class="ls-appointment-task" ls-add-task></md-item>' +
                // '<ls-task ng-repeat="task in tasks" ng-model="task"></ls-task>' +
                '</md-list>',
            link: link
        };

        function link(scope, element, attrs) {
            scope.tasks = [];
            scope.appointmentId = attrs.appointmentId;
            lsTasksService.getAppointmentTasks(attrs.appointmentId)
                .then(function(tasks) {
                    scope.tasks = tasks;
                });

            // called from child add scope
            scope.add = function(task) {
                scope.tasks.push(task);
            };

            // called from child view scope
            scope.remove = function(id) {
                var _i,
                    _l = scope.tasks.length;
                for (_i = 0; _i < _l; _i += 1) {
                    if (scope.tasks[_i].id === id) {
                        scope.tasks.splice(_i, 1);
                        return;
                    }
                }
            };
        }
    }

    /**
     * @ngdoc directive
     * @name ls.directive:lsTask
     * @restrict E
     *
     * @description
     * Displays and edits a task
     *
     */
    angular.module('ls').directive('lsTask', taskDirective);
    taskDirective.$inject = [];

    function taskDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            require: 'ngModel',
            template: '<div>' +
                '<ls-view-task ng-if="isViewVisible"></ls-view-task>' +
                '<ls-edit-task ng-if="isEditVisible"></ls-edit-task>' +
                '</div>',
            link: link
        };

        function link(scope, element, attrs, ngModel) {
            scope.ngModel = ngModel;
            scope.isViewVisible = true;
            scope.isEditVisible = false;
        }
    }

    /**
     * @ngdoc directive
     * @name ls.directive:lsViewTask
     * @restrict E
     *
     * @description
     * Displays a task
     *
     */
    angular.module('ls').directive('lsViewTask', viewDirective);
    viewDirective.$inject = ['$mdDialog', 'lsUserActionsService'];

    function viewDirective($mdDialog, lsUserActionsService) {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: true,
            templateUrl: 'src/tasks/view_task.html',
            link: link
        };

        function link(scope, element, attrs, ngModel) {
            // the task model
            scope.ngModel = ngModel;
            var _task = scope.ngModel.$modelValue;
            scope.markAs = markAs;
            scope.updating = false;

            /**
             * mark a task as complete/incomplete
             */
            function markAs() {
                scope.updating = true;
                if (_task.completed) {
                    _task.status = 'updating task as incomplete';
                    _task.markIncompleteAsync()
                        .then(function() {
                            element[0].classList.remove('complete');
                            scope.updating = false;
                        });
                } else {
                    _task.status = 'updating task as complete';
                    _task.markCompleteAsync()
                        .then(function() {
                            element[0].classList.add('complete');
                            scope.updating = false;
                        });
                }
            }
        }
    }


    /**
     * @ngdoc directive
     * @name ls.directive:lsViewTask
     * @restrict E
     *
     * @description
     * Displays a task
     *
     */
    angular.module('ls').directive('lsTaskActionMenu', actionMenuDirective);
    actionMenuDirective.$inject = ['$mdDialog', 'lsUserActionsService'];

    function actionMenuDirective($mdDialog, lsUserActionsService) {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: 'src/tasks/action_menu.html',
            link: link
        };

        function link(scope, element, attrs) {
            // the task model
            var _task = scope.ngModel.$modelValue,
                _taskScope = scope.$parent,
                _ngRepeatScope = _taskScope.$parent;

            // watch changes in disable at the ng-repeat scope level
            // _ngRepeatScope.$watch('disabled', function() {
            //     scope.disabled = _ngRepeatScope.disabled;
            // });

            scope.openMenu = openMenu;
            scope.showDeleteConfirm = showDeleteConfirm;
            scope.updating = false;
            scope.menuOpened = false;

            /**
             * edit user action
             */
            scope.edit = angular.copy(lsUserActionsService.getUserAction('taskItemEdit'));
            scope.edit.action = edit;

            function edit() {
                closeMenu();
                scope.$parent.isViewVisible = false;
                scope.$parent.isEditVisible = true;
            }

            /**
             * delete user action
             */
            scope.del = angular.copy(lsUserActionsService.getUserAction('taskItemDelete'));
            scope.del.action = showDeleteConfirm;

            function showDeleteConfirm(ev) {
                closeMenu();
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete this task?')
                    .ariaLabel('delete this task?')
                    .ok('Please do')
                    .cancel('Cancel')
                    .targetEvent(ev);

                $mdDialog.show(confirm).then(deleteTask);

                function deleteTask() {
                    scope.updating = true;
                    _task.status = 'deleting...';
                    _task.deleteAsync().then(function() {
                        scope.$parent.$parent.$parent.remove(_task.id);
                    });

                }
            }

            /**
             * color red user action
             */
            scope.red = angular.copy(lsUserActionsService.getUserAction('taskItemRed'));
            scope.red.action = red;

            function red() {
                closeMenu();
                scope.updating = true;
                _task.colorRedAsync().then(function() {
                    scope.updating = false;
                });
            }

            /**
             * color green user action
             */
            scope.green = angular.copy(lsUserActionsService.getUserAction('taskItemGreen'));
            scope.green.action = green;

            function green() {
                closeMenu();
                scope.updating = true;
                _task.colorGreenAsync().then(function() {
                    scope.updating = false;
                });
            }

            /**
             * color blue user action
             */
            scope.blue = angular.copy(lsUserActionsService.getUserAction('taskItemBlue'));
            scope.blue.action = blue;

            function blue() {
                closeMenu();
                _task.colorBlueAsync().then(function() {
                    scope.updating = false;
                });
            }

            /**
             * open the user action menu
             */
            function openMenu() {
                scope.menuOpened = true;
                document.onkeydown = function(e) {
                    if (e.keyCode == 27) {
                        closeMenu();
                        scope.$apply();
                    } // esc
                };
            }

            function closeMenu() {
                scope.menuOpened = false;
                document.onkeydown = null;
            }

        }
    }

    /**
     * @ngdoc directive
     * @name ls.directive:lsEditTask
     * @restrict E
     *
     * @description
     * Edits a task
     */
    angular.module('ls').directive('lsEditTask', editDirective);
    editDirective.$inject = [];

    function editDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            templateUrl: '/src/tasks/edit_task.html',
            link: link
        };

        function link(scope, element, attrs) {
            // the task model
            var _task = scope.ngModel.$modelValue,
                _taskScope = scope.$parent,
                _ngRepeatScope = scope.$parent.$parent,
                _tasksScope = scope.$parent.$parent.$parent;

            setTasksDisabled(true);

            scope.save = function() {
                scope.updating = true;
                _task.updateNoteAsync()
                    .then(function() {
                        scope.updating = false;
                        setTasksDisabled(false);
                        _taskScope.isViewVisible = true;
                        _taskScope.isEditVisible = false;
                    });
            };

            scope.cancel = function() {
                _task.unsetNote();
                setTasksDisabled(false);
                _taskScope.isViewVisible = true;
                _taskScope.isEditVisible = false;
            };

            scope.$on('destroy', function() {
                document.onkeydown = null;
            });

            function setTasksDisabled(disabled) {
                // disable all other items
                var _next = _ngRepeatScope.$$nextSibling;
                while (_next) {
                    _next.disabled = disabled;
                    _next = _next.$$nextSibling;
                }
                _next = _ngRepeatScope.$$prevSibling;
                while (_next) {
                    _next.disabled = disabled;
                    _next = _next.$$prevSibling;
                }
                document.onkeydown = function(e) {
                    if (e.keyCode == 27) {
                        scope.cancel();
                        scope.$apply();
                    } // esc
                };
            }
        }
    }


    /**
     * @ngdoc directive
     * @name ls.directive:lsAddTask
     * @restrict E
     *
     * @description
     * Adds a task
     */
    angular.module('ls').directive('lsAddTask', addDirective);
    addDirective.$inject = ['lsCacheService'];

    function addDirective(lsCacheService) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'src/tasks/add_task.html',
            link: link
        };

        function link(scope, element, attrs) {
            /**
             * Add the task to our list
             */
            scope.showAdd = function() {
                return !scope.adding && scope.description && scope.description.length > 0;
            };
            scope.adding = false; // true while add in progress
            scope.add = function() {
                scope.adding = true;
                lsCacheService.tasks.addAsync(scope.$parent.appointmentId, scope.description)
                    .then(function(task) {
                        scope.adding = false;
                        scope.description = null;
                        // add task to parent scope
                        scope.$parent.add(task);
                    });
            };

            /**
             * clear the task
             */
            scope.showClear = function() {
                return !scope.adding && scope.description && scope.description.length > 0;
            };
            scope.clear = function() {
                scope.description = null;
            };
        }
    }
})();

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
        .factory('lsTasksService', appointmentsService);

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

(function(angular) {
    'use strict';

    var _lsDateService;

    /**
     * @ngdoc service
     * @name ls.service:lsTaskModel
     *
     * @description
     * Creates a task models from objects.
     *
     */
    angular.module('ls.tasks.models',[])
    .factory('lsTaskModel', factory);

    factory.$inject = ['lsModelsBase', 'lsDateService'];

    function factory(lsModelsBase, lsDateService) {
        var _service = {
            create: create,
            createArrayFromApi: createArrayFromApi
        };

        _lsDateService = lsDateService;

        /**
         * convert incomming data from API to an array of Task
         * @param  {Array} arr array of objects
         * @return {Array}     array of Task
         */
        function createArrayFromApi(arr, updateMethods) {
            return lsModelsBase.createModelArray(arr, createModelFromApi, updateMethods);
        }

        /**
         * convert incomming data from API to an appointment task model
         * @param  {object} data      incomming data from API
         * @return {Task}      an appointment task model
         */
        function createModelFromApi(data, updateMethods) {
            var _m = new Task();

            _m.id = data.id;
            _m.appointmentId = data.appointmentId;
            _m.description = data.description;
            _m.editDescription = _m.description;
            _m.entered = data.entered;
            _m.enteredBy = data.enteredBy;
            _m.completed = data.completed ? data.completed : false;
            _m.completedBy = data.completedBy ? data.completedBy : null;
            updateStatus(_m);
            return _m;
        }


        function create(appointmentId, entered, enteredBy, description, updateMethods) {
            return createModelFromApi({
                id: null,
                appointmentId: appointmentId,
                description: description,
                entered: entered,
                enteredBy: enteredBy
            }, updateMethods);
        }


        return _service;
    }

    function Task() {
        // id - GUID
        this.id = '';

        // appointmentId - GUID of the parent appointment
        this.appointmentId = 0;

        // description - A 512 character text describing the task
        this.description = '';

        // editDescription - stores the description while editing
        this.editDescription = '';

        // entered - A Unix time stamp when task was added
        this.entered = 0;

        // enteredBy - the full name of the user who entered the task
        this.enteredBy = '';

        // completedDate - A Unix timestamp when complete (null if not complete)
        this.completedDate = null;

        // completed - true if task is complete
        this.completed = false;

        //completedBy - the full name of the user who completed the task
        this.completedBy = '';

        // status  - a status message “entered {enter date} by {entered user},
        //           completed on {complete date } by {complete date}”
        this.status = '';
    }

    Task.prototype.setComplete = function(date, by) {
        var _self = this;
        _self.completedDate = date;
        _self.completedBy = by;
        _self.completed = true;
        updateStatus(_self);
        return this;
    };

    Task.prototype.setIncomplete = function() {
        var _self = this;
        _self.completedDate = null;
        _self.completedBy = null;
        _self.completed = false;
        updateStatus(_self);
        return this;
    };

    Task.prototype.setDescription = function() {
        var _self = this;
        _self.description = _self.editDescription;
        updateStatus(_self);
        return this;
    };

    Task.prototype.setColor = function(color) {
        var _self = this;
        _self.color = 'ls-background-' + color;
        updateStatus(_self);
        return this;
    };

    Task.prototype.unsetDescription = function() {
        var _self = this;
        _self.editDescription = _self.description;
        updateStatus(_self);
        return this;
    };

    function updateStatus(task) {
        task.status = 'entered on ' +
            _lsDateService.formattedDate(task.entered) +
            ' by ' +
            task.enteredBy;
        if (task.completedDate) {
            task.status += ', completed on ' +
                _lsDateService.formattedDate(task.completedDate) +
                ' by ' +
                task.completedBy;
        }
    }
})(angular);
