(function(angular, moment) {
    'use strict';
    var _moduleId = 'ls',
        _lsMenuModelFactory,
        _lsModelsBase,
        // setup funciton run before each test
        _setup = function() {
            angular.mock.module(_moduleId);
            // inject the lsMenuModelFactory service
            angular.mock.inject(function(_lsMenuModelFactory_, _lsModelsBase_) {
                _lsMenuModelFactory = _lsMenuModelFactory_;
                _lsModelsBase = _lsModelsBase_;
            });
        },
        // tear down after each test
        _teardown = function() {

        },
        _testData = [{
            path: '/projects',
            route: {
                templateUrl: 'src/projects/projects.html',
                controller: 'lsprojects',
                controllerAs: 'vm'
            },
            config: {
                pageTitle: 'Projects',
                nav: {
                    order: 2,
                    nav: 'main',
                    label: 'Projects',
                    tooltip: 'view my projects'
                }
            }
        },
        {
            path: '/appointments',
            route: {
                templateUrl: 'src/appointments/appointments.html',
                controller: 'lsappointments',
                controllerAs: 'vm'
            },
            config: {
                pageTitle: 'Appointments',
                nav: {
                    order: 2,
                    nav: 'main',
                    label: 'Appointments',
                    tooltip: 'view my appointments'
                }
            }
        }];

    describe('lsMenuModelFactory', function() {

        //Setup
        beforeEach(_setup);

        describe('expecting createModelFromRoute', function() {
            it('should create a menu model from an object', function() {
                var _expected = _testData,
                    _result = _lsMenuModelFactory.createFromRoute(_expected, 'main');
                expect(_result.id).toBe('main');
                expect(_result.items.length).toBe(_expected.length);
                expect(_result.items[0].label).toBe(_expected[0].config.nav.label);
                expect(_result.items[0].order).toBe(_expected[0].config.nav.order);
                expect(_result.items[0].tooltip).toBe(_expected[0].config.nav.tooltip);
                expect(_result.items[0].url).toBe('/#'+_expected[0].path);

            });
        });

        //Teardown
        afterEach(_teardown);
    });


})(angular, moment);
