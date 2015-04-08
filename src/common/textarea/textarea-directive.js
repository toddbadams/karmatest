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
    angular.module('ls').directive('lsTasks', tasksDirective);
    tasksDirective.$inject = ['lsTasksService'];

    function tasksDirective(lsTasksService) {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: '/src/tasks/tasks.html',
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
    addDirective.$inject = ['lsTasksService'];

    function addDirective(lsTasksService) {
        return {
            restrict: 'E',
            replace: true,
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
                lsTasksService.addAsync(scope.$parent.appointmentId, scope.description)
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
