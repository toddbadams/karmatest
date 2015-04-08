(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name ls.directive:lsNotes
     * @restrict E
     *
     * @description
     * Displays and edits a set of notes
     *
     */
    angular.module('ls').directive('lsNotes', notesDirective);
    notesDirective.$inject = ['lsNotesService'];

    function notesDirective(lsNotesService) {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: '/src/notes/notes.html',
            link: link
        };

        function link(scope, element, attrs) {
            scope.notes = [];
            scope.appointmentId = attrs.appointmentId;
            lsNotesService.getAppointmentNotes(attrs.appointmentId)
                .then(function(notes) {
                    scope.notes = notes;
                });

            // called from child add scope
            scope.add = function(note) {
                scope.notes.push(note);
            };

            // called from child view scope
            scope.remove = function(id) {
                var _i,
                    _l = scope.notes.length;
                for (_i = 0; _i < _l; _i += 1) {
                    if (scope.notes[_i].id === id) {
                        scope.notes.splice(_i, 1);
                        return;
                    }
                }
            };
        }
    }

    /**
     * @ngdoc directive
     * @name ls.directive:lsNote
     * @restrict E
     *
     * @description
     * Displays and edits a note
     *
     */
    angular.module('ls').directive('lsNote', noteDirective);
    noteDirective.$inject = [];

    function noteDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            require: 'ngModel',
            template: '<div>' +
                '<ls-view-note ng-if="isViewVisible"></ls-view-note>' +
                '<ls-edit-note ng-if="isEditVisible"></ls-edit-note>' +
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
     * @name ls.directive:lsViewNote
     * @restrict E
     *
     * @description
     * Displays a note
     *
     */
    angular.module('ls').directive('lsViewNote', viewDirective);
    viewDirective.$inject = ['$mdDialog', 'lsUserActionsService'];

    function viewDirective($mdDialog, lsUserActionsService) {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: '/src/notes/view_note.html',
            link: link
        };

        function link(scope, element, attrs) {
            // the note model
            var _note = scope.ngModel.$modelValue;
            scope.updating = false;
        }
    }


    /**
     * @ngdoc directive
     * @name ls.directive:lsViewNote
     * @restrict E
     *
     * @description
     * Displays a note
     *
     */
    angular.module('ls').directive('lsNoteActionMenu', actionMenuDirective);
    actionMenuDirective.$inject = ['$mdDialog', 'lsUserActionsService'];

    function actionMenuDirective($mdDialog, lsUserActionsService) {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: '/src/notes/action_menu.html',
            link: link
        };

        function link(scope, element, attrs) {
            // the note model
            var _note = scope.ngModel.$modelValue,
                _noteScope = scope.$parent,
                _ngRepeatScope = _noteScope.$parent;

            // watch changes in disable at the ng-repeat scope level
            _ngRepeatScope.$watch('disabled', function() {
                scope.disabled = _ngRepeatScope.disabled;
            });

            scope.openMenu = openMenu;
            scope.showDeleteConfirm = showDeleteConfirm;
            scope.updating = false;
            scope.menuOpened = false;

            /**
             * edit user action
             */
            scope.edit = angular.copy(lsUserActionsService.getUserAction('noteItemEdit'));
            scope.edit.action = edit;

            function edit() {
                closeMenu();
                scope.$parent.isViewVisible = false;
                scope.$parent.isEditVisible = true;
            }

            /**
             * delete user action
             */
            scope.del = angular.copy(lsUserActionsService.getUserAction('noteItemDelete'));
            scope.del.action = showDeleteConfirm;

            function showDeleteConfirm(ev) {
                closeMenu();
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete this note?')
                    .ariaLabel('delete this note?')
                    .ok('Please do')
                    .cancel('Cancel')
                    .targetEvent(ev);

                $mdDialog.show(confirm).then(deleteNote);

                function deleteNote() {
                    scope.updating = true;
                    _note.status = 'deleting...';
                    _note.deleteAsync().then(function() {
                        scope.$parent.$parent.$parent.remove(_note.id);
                    });

                }
            }

            /**
             * color red user action
             */
            scope.red = angular.copy(lsUserActionsService.getUserAction('noteItemRed'));
            scope.red.action = red;

            function red() {
                closeMenu();
                scope.updating = true;
                _note.colorRedAsync().then(function() {
                    scope.updating = false;
                });
            }

            /**
             * color green user action
             */
            scope.green = angular.copy(lsUserActionsService.getUserAction('noteItemGreen'));
            scope.green.action = green;

            function green() {
                closeMenu();
                scope.updating = true;
                _note.colorGreenAsync().then(function() {
                    scope.updating = false;
                });
            }

            /**
             * color blue user action
             */
            scope.blue = angular.copy(lsUserActionsService.getUserAction('noteItemBlue'));
            scope.blue.action = blue;

            function blue() {
                closeMenu();
                _note.colorBlueAsync().then(function() {
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
     * @name ls.directive:lsEditNote
     * @restrict E
     *
     * @description
     * Edits a note
     */
    angular.module('ls').directive('lsEditNote', editDirective);
    editDirective.$inject = [];

    function editDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            templateUrl: '/src/notes/edit_note.html',
            link: link
        };

        function link(scope, element, attrs) {
            // the note model
            var _note = scope.ngModel.$modelValue,
                _noteScope = scope.$parent,
                _ngRepeatScope = scope.$parent.$parent,
                _notesScope = scope.$parent.$parent.$parent;

            setNotesDisabled(true);

            scope.save = function() {
                scope.updating = true;
                _note.updateNoteAsync()
                    .then(function() {
                        scope.updating = false;
                        setNotesDisabled(false);
                        _noteScope.isViewVisible = true;
                        _noteScope.isEditVisible = false;
                    });
            };

            scope.cancel = function() {
                _note.unsetNote();
                setNotesDisabled(false);
                _noteScope.isViewVisible = true;
                _noteScope.isEditVisible = false;
            };

            scope.$on('destroy', function() {
                document.onkeydown = null;
            });

            function setNotesDisabled(disabled) {
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
     * @name ls.directive:lsAddNote
     * @restrict E
     *
     * @description
     * Adds a note
     */
    angular.module('ls').directive('lsAddNote', addDirective);
    addDirective.$inject = ['lsNotesService'];

    function addDirective(lsNotesService) {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: '/src/notes/add_note.html',
            link: link
        };

        function link(scope, element, attrs) {
            /**
             * Add the note to our list
             */
            scope.showAdd = function() {
                return !scope.adding && scope.description && scope.description.length > 0;
            };
            scope.adding = false; // true while add in progress
            scope.add = function() {
                scope.adding = true;
                lsNotesService.addAsync(scope.$parent.appointmentId, scope.description)
                    .then(function(note) {
                        scope.adding = false;
                        scope.description = null;
                        // add note to parent scope
                        scope.$parent.add(note);
                    });
            };

            /**
             * clear the note
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
