(function(angular, moment) {
    'use strict';
    var _moduleId = 'ls',
        _lsDateService,
        // setup funciton run before each test
        _setup = function() {
            angular.mock.module(_moduleId);
            // inject the lsDateService service
            angular.mock.inject(function(_lsDateService_) {
                _lsDateService = _lsDateService_;
            });
        },
        // tear down after each test
        _teardown = function() {

        };

    describe('lsDateService service', function() {

        //Setup
        beforeEach(_setup);

        describe('expecting formattedDate', function() {
            it('should format date zero as Jan 1, 1970', function() {
                var _expected = 'Jan 1, 1970',
                    _zeroDate = 0,
                    _result = _lsDateService.formattedDate(_zeroDate);
                expect(_result).toBe(_expected);
            });
        });

        describe('expecting firstDayOfMonth', function() {
            it('should return the first day of the month as a unix timestamp', function() {
                var _expected = 0, // jan 1 1970  00:00:00
                    _testDate = 1944000, // jan 23 1970 12:00:00
                    _result = _lsDateService.firstDayOfMonth(_testDate);
                expect(_result).toBe(_expected);
            });
        });

        describe('expecting lastDayOfMonth', function() {
            it('should return the last day of the month as a unix timestamp', function() {
                var _expected = 2678399, // Jan 31 1970 23:59:59
                    _testDate = 1944000, // jan 23 1970 12:00:00
                    _result = _lsDateService.lastDayOfMonth(_testDate);
                expect(_result).toBe(_expected);
            });
        });


        describe('expecting firstDayOfWeek', function() {
            it('should return the first day of the week as a unix timestamp', function() {
                var _expected = 1468800, // jan 18 1970 00:00:00
                    _testDate = 1944000, // jan 23 1970 12:00:00
                    _result = _lsDateService.firstDayOfWeek(_testDate);
                expect(_result).toBe(_expected);
            });
        });

        describe('expecting lastDayOfWeek', function() {
            it('should return the last day of the week as a unix timestamp', function() {
                var _expected = 2073599, // Jan 24 1970 23:59:59
                    _testDate = 1944000, // jan 23 1970 12:00:00
                    _result = _lsDateService.lastDayOfWeek(_testDate);
                expect(_result).toBe(_expected);
            });
        });

        //Teardown
        afterEach(_teardown);
    });


})(angular, moment);
