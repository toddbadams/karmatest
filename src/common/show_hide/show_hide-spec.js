(function() {
    'use strict';
    describe('As a user I want to click on a button to remove a "ls-hide" CSS' +
        ' class from one DOM element within a group of DOM elements and the' +
        ' same CSS class to the other DOM elements within the same group.' +
        ' At the same time the I want to add a "ls-active" CSS class to the' +
        ' clicked button while removing the same CSS class to the other DOM' +
        ' elements in the group of buttons.',
        function() {

            var $compile,
                scope,
                _element,
                _active = 'ls-active',
                _hidden = 'ls-hidden',
                _html = '<div>' +
                '<button ls-show-btn ls-group="g" ls-id="a"></button>' +
                '<button ls-show-btn ls-group="g" ls-id="b"></button>' +
                '<div ls-show-item ls-group="g" ls-id="a"></div>' +
                '<div ls-show-item ls-group="g" ls-id="b"></div>' +
                '</div>',
                _clickEvent = new Event('click');

            beforeEach(angular.mock.module('ls'));
            beforeEach(angular.mock.inject(function(_$compile_, _$rootScope_) {
                $compile = _$compile_;
                scope = _$rootScope_;
                _element = angular.element(_html);
            }));

            function createDom() {
                $compile(_element)(scope);
            }

            function findBtnA() {
                return _element.children()[0];
            }

            function clickBtnA() {
                return findBtnA().dispatchEvent(_clickEvent);
            }

            function btnAIsActive() {
                return findBtnA().classList.contains(_active);
            }

            function findBtnB() {
                return _element.children()[1];
            }

            function btnBIsActive() {
                return findBtnB().classList.contains(_active);
            }

            function divAIsHidden() {
                return _element.children()[2].classList.contains(_hidden);
            }

            function divBIsHidden() {
                return _element.children()[3].classList.contains(_hidden);
            }

            describe('expecting a button click', function() {
                it('has the added the "ls-active" CSS class to itself',
                    function() {
                        createDom();
                        clickBtnA();
                        expect(btnAIsActive()).toBeTruthy();
                    });
                it('has the removed the "ls-active" CSS class from the other' +
                    ' buttons in the group',
                    function() {
                        createDom();
                        clickBtnA();
                        expect(btnBIsActive()).toBeFalsy();
                    });
                it('has the removed the "ls-hidden" CSS class from the DOM' +
                    ' element with the same group and id.',
                    function() {
                        createDom();
                        clickBtnA();
                        expect(divAIsHidden()).toBeFalsy();
                    });
                it('has the added the "ls-hidden" CSS class from the other DOM' +
                    ' elements in the group',
                    function() {
                        createDom();
                        clickBtnA();
                        expect(divBIsHidden()).toBeTruthy();
                    });
            });
        });
})();
