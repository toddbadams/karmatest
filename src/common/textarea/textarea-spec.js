(function(angular, moment, chance) {
    'use strict';
    describe('Text Area Feature', function() {
        var _runUserStory = null, // null for all
            _runAcceptanceCriteria = null, // null for all
            _dateFormat = 'MMM D, YYYY',
            $compile,
            $timeout,
            scope,
            _description = '512 chacter note. Lorem ipsum dolor sit amet, ' +
            'consectetur adipiscing elit. Donec eleifend accumsan nulla, quis ' +
            'tincidunt urna ullamcorper et. Nulla nec nulla lacus. Sed sem nibh, ' +
            'finibus interdum vulputate eu, molestie non purus. Interdums et ' +
            'malesuada fames ac antedolor est, ipsum primis in faucibus. Nunc ' +
            'varius rutrum euismod. Integaer dignissim, ipsum veal lacinia placerat, ' +
            'tortor enim imperdiet velit, eu feugiat eu feugiat leo lectus et ' +
            'arcu. Morbi dolor est, porttitor nec neque quis, ultricies rutrums.',
            _expectedTooLongDescMessage = 'Please shorten the task description.',
            _lsTasksService,
            _apptId = chance.guid(),
            _element,
            _task,
            _uut, // unit under test
            _enteredDate = moment().unix(), // now in unix
            _enteredBy = 'Todd B. Adams',
            _enteredStatus = 'entered on ' +
            moment.unix(_enteredDate).format(_dateFormat) +
            ' by ' + _enteredBy,
            _completeDate = 1944000, // Jan 23, 1970  12:00
            _completedBy = 'B. User',
            _completedStatus = _enteredStatus + ', completed on ' +
            moment.unix(_completeDate).format(_dateFormat) +
            ' by ' + _completedBy;

        //Setup
        beforeEach(module('ls'));
        beforeEach(module('templates'));
        beforeEach(inject(function(_$compile_, _$timeout_, _$rootScope_, _lsTasksService_) {
            $compile = _$compile_;
            $timeout = _$timeout_;
            scope = _$rootScope_;
            _lsTasksService = _lsTasksService_;
        }));
        if (_runUserStory === null || _runUserStory === 1) {
            describe('1. As a user, I want to enter text into a text area so that'+
                'the text can be used in an add item or edit item',
                function() {
                    // the add task dom element
                    var _element;

                    function createAddTaskDomElement(html) {
                        _element = $compile(html)(scope);
                        scope.$digest();
                        scope.onenteredtriggered = false;
                        scope.onenter = function() {
                            scope.onenteredtriggered = true;
                        };
                    }

                    function getForm() {
                        return _element.find('form');
                    }

                    function getDescriptionTextArea() {
                        return getForm(_element).find('textarea');
                    }

                    function setAddDescription(description) {
                        getDescriptionTextArea().val(description);
                        var _ev = new Event('change');
                        getDescriptionTextArea()[0].dispatchEvent(_ev);
                    }

                    function getErrorMessage() {
                        // error message is next element sibling from text area
                        return getDescriptionTextArea()[0]
                            .nextElementSibling.children[0].innerHTML;
                    }

                    function getCharacterCount() {
                        // character count is second element sibling from text area
                        return getDescriptionTextArea()[0]
                            .nextElementSibling
                            .nextElementSibling.innerHTML;
                    }

                    function getActionMenu() {
                        return _element[0].children[0].children[1];
                    }

                    function addButtonVisible() {
                        // character count is second element sibling from text area
                        return !getActionMenu().children[0].children[1].classList.contains('ng-hide');
                    }

                    it('a. An error message "Please shorten the task description" is ' +
                        'displayed when the entered text exceeds maximum character length.',
                        function() {
                            var _html = '<ls-textarea max-length="512"></ls-textarea>';
                            createAddTaskDomElement(_html);
                            setAddDescription(_description + 'a'); // 513 characters
                            expect(getErrorMessage() === _expectedTooLongDescMessage)
                                .toBeTruthy();
                        });

                    it('b. A character count is displayed showing the entered length ' +
                        'and max length.',
                        function() {
                            createAddTaskDomElement();
                            setAddDescription('abcdef'); // 6 characters
                            expect(getCharacterCount() === '6/512')
                                .toBeTruthy();
                        });

                    it('c. Pressing RETURN on the keyboard does nothing when there is ' +
                        'no entered text description.',
                        function() {
                            createAddTaskDomElement();
                        });

                    it('d. Pressing RETURN on the keyboard triggers a ONENTER function when there ' +
                        'is a text description.',
                        function() {
                            createAddTaskDomElement();
                        });

                    it('e. Pressing ESCAPE on the keyboard clears the text.',
                        function() {
                            createAddTaskDomElement();
                        });
                });
        }
        if (_runUserStory === null || _runUserStory === 2) {
            describe('2. As a user, I want to view tasks in a list, so I and others ' +
                'can understand the work to be completed. (MVP)',
                function() {
                    function getMdTile() {
                        return _element[0].children[0].children[0];
                    }

                    function getMdTileContent() {
                        return getMdTile().children[1];
                    }

                    function getDescription() {
                        return getMdTileContent().children[0].innerHTML;
                    }

                    function getStatus() {
                        return getMdTileContent().children[1].innerHTML;
                    }

                    function getCheckbox() {
                        var _string = getMdTile().children[0].children[0].attributes['aria-checked'].value;
                        if (_string === 'true') return true;
                        if (_string = 'false') return false;
                        return null;
                    }

                    function getActionMenuBtn() {
                        return '';
                    }

                    beforeEach(function(done) {
                        _lsTasksService.addAsync(_apptId, _description)
                            .then(function(task) {
                                _task = task;
                                scope.task = _task;
                                _element = $compile('<ls-view-task ng-model="task"></ls-view-task>')(scope);
                                $timeout(function() {
                                    scope.$digest();
                                    done();
                                });
                            });

                        // http://stackoverflow.com/questions/17350492/angularjs-timeout-function-not-executing-in-my-jasmine-specs
                        $timeout.flush();
                    });

                    if (_runAcceptanceCriteria === null || _runAcceptanceCriteria === 'a') {
                        it('a. The task view contains the task description.',
                            function() {
                                _uut = scope.task.description;
                                expect(_uut).toBe(_description);
                                _uut = getDescription();
                                expect(_uut).toBe(_description);
                            });
                    }
                    if (_runAcceptanceCriteria === null || _runAcceptanceCriteria === 'b') {
                        it('b. The task view contains a status.',
                            function() {
                                _uut = scope.task.status;
                                expect(_uut).not.toBeNull();
                                _uut = getStatus();
                                expect(_uut).not.toBeNull();
                            });
                    }
                    if (_runAcceptanceCriteria === null || _runAcceptanceCriteria === 'c') {
                        it('c. The status contains name of the creation user and date ' +
                            'in the format "entered on (date) by (user)".',
                            function() {
                                _uut = scope.task.status;
                                expect(_uut).toBe(_enteredStatus);
                                _uut = getStatus();
                                expect(_uut).toBe(_enteredStatus);
                            });
                    }
                    if (_runAcceptanceCriteria === null || _runAcceptanceCriteria === 'd') {
                        it('d. The task view contains a checkbox which shows complete ' +
                            'status.',
                            function() {
                                _uut = _task.completed;
                                expect(_uut).not.toBeNull();
                                _uut = getCheckbox();
                                expect(_uut).not.toBeNull();
                            });
                    }
                    if (_runAcceptanceCriteria === null || _runAcceptanceCriteria === 'e') {
                        it('e. The task view contains a checkbox which is true when the ' +
                            'task is complete.',
                            function() {
                                _task.setComplete(_completeDate, _completedBy);
                                scope.$apply();
                                _uut = _task.completed;
                                expect(_uut).toBeTruthy();
                                _uut = getCheckbox();
                                expect(_uut).toBeTruthy();
                            });
                    }
                    if (_runAcceptanceCriteria === null || _runAcceptanceCriteria === 'f') {
                        it('f. The task view contains a checkbox which is false when ' +
                            'the task is not complete.',
                            function() {
                                _task.setIncomplete();
                                scope.$apply();
                                _uut = _task.status;
                                expect(_uut).toBe(_enteredStatus);
                                _uut = getStatus();
                                expect(_uut).toBe(_enteredStatus);
                                _uut = getCheckbox();
                                expect(_uut).toBeFalsy();
                            });
                    }
                    if (_runAcceptanceCriteria === null || _runAcceptanceCriteria === 'g') {
                        it('g. The status contains the complete user and date when ' +
                            'complete in the format "completed on (date) by (user)".',
                            function() {
                                _task.setComplete(_completeDate, _completedBy);
                                scope.$apply();
                                _uut = _task.status;
                                expect(_uut).toBe(_completedStatus);
                                _uut = getStatus();
                                expect(_uut).toBe(_completedStatus);
                            });
                    }
                    if (_runAcceptanceCriteria === null || _runAcceptanceCriteria === 'h') {
                        it('h. The task view contains a button for launching the ' +
                            'action menu.',
                            function() {
                                // createViewDomElement();
                                // expect(getActionMenuBtn()).toNotBe(null);
                            });
                    }
                });
        }
    });
})(angular, moment, chance);
