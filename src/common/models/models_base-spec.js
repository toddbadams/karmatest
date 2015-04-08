(function(angular, moment) {
    'use strict';
    var _moduleId = 'ls',
        _lsModelsBase,
        // setup funciton run before each test
        _setup = function() {
            angular.mock.module(_moduleId);
            // inject the lsModelsBase service
            angular.mock.inject(function(_lsModelsBase_) {
                _lsModelsBase = _lsModelsBase_;
            });
        },
        // tear down after each test
        _teardown = function() {

        },
        _testData = [{
            id: 1,
            date: '12/30/89',
        }, {
            id: 2,
            date: '12/30/90',
        }, {
            id: 3,
            date: '12/30/91',
        }, {
            id: 4,
            date: '12/30/92',
        }];

    function TestModel() {
        this.id = 0;
        this.date = '';
    }

    function createTestModel(data) {
        var _m = new TestModel();
        _m.id = data.id;
        _m.date = moment(data.date);
        return _m;
    }

    describe('lsModelsBase service', function() {

        //Setup
        beforeEach(_setup);

        describe('expecting createModelArray', function() {
            it('should create an array of models from an object', function() {
                var _expected = _testData,
                    _result = _lsModelsBase.createModelArray(_expected, createTestModel);

                expect(_result.length).toBe(_expected.length);
                expect(_result[0].id).toBe(_expected[0].id);
            });
        });

        describe('expecting createModelDatePaged', function() {
            it('should create a date paged set of models from an object', function() {
                var _i,
                    _expected = {
                        start: '12/30/89',
                        end: '12/30/92',
                        total: 4,
                        pageTotal: 4,
                        list: _testData
                    },
                    _startUnix = moment(_expected.start).unix(),
                    _endUnix = moment(_expected.end).unix(),
                    _result;

                _result = _lsModelsBase.createModelDatePaged(_expected, createTestModel);
                expect(_result.startUnix).toBe(_startUnix);
                expect(_result.endUnix).toBe(_endUnix);
                expect(_result.total).toBe(_expected.total);
                expect(_result.pagedTotal).toBe(_expected.pagedTotal);
                expect(_result.list.length).toBe(_expected.list.length);
                expect(_result.list[0].id).toBe(_expected.list[0].id);
            });
        });

        //Teardown
        afterEach(_teardown);
    });


})(angular, moment);
