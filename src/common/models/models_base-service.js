(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _serviceId = 'lsModelsBase';

    /**
     * @ngdoc service
     * @name lsModels
     * @module ls
     *
     * @description
     * Creates models from objects. Used to receive incomming web api
     * objects, then validate and create object.
     *
     */
    angular.module(_moduleId)
        .factory(_serviceId, factory);

    factory.$inject = ['lsDateService'];

    function factory(dateService) {
        var _service = {
            createModelPaged: createPagedModel,
            createModelDatePaged: createModelDatePaged,
            createModelArray: createModelArray,
            defaultOption: defaultOption
        };

        /**
         * Paged Model
         */
        function Paged() {
            this.start = 0;
            this.limit = 0;
            this.total = 0;
            this.pageTotal = 0;
            this.list = [];
        }

        function createPagedModel(data, mapFn) {
            var _m = new Paged();
            // one based starting record number
            _m.start = data.start;
            // one base number of records returned (requested)
            _m.limit = data.limit;
            // total records in data store
            _m.total = data.total;
            // number of records returned
            _m.pageTotal = data.start + data.limit > data.total ?
                data.total - data.start :
                data.limit;
            // a list of records for this page
            _m.list = data.list.map(mapFn);
            return _m;
        }

        /**
         * DatePaged Model
         * similar to paged, but start and end are dates.
         */
        function DatePaged() {
            // starting date
            this.setStart(dateService.dateZero());
            // ending date
            this.setEnd(dateService.dateZero());
            // total records in data store
            this.total = 0;
            // total records in this page
            this.pageTotal = 0;
            // the list of records
            this.list = [];
        }

        function createModelDatePaged(data, mapFn) {
            var _m = new DatePaged();
            _m.setStart(data.start);
            _m.setEnd(data.end);
            _m.total = data.total;
            _m.list = data.list.map(mapFn);
            _m.pageTotal = _m.list.length;
            return _m;
        }

        DatePaged.prototype.setStart = function(date) {
            this.start = moment(date);
            this.startUnix = this.start.unix();
            return this;
        };


        DatePaged.prototype.setEnd = function(date) {
            this.end = moment(date);
            this.endUnix = this.end.unix();
            return this;
        };

        /**
         * LS Array Object inherits from Array
         */
        function createModelArray(arr, parseFn, args) {
            var _m = [],
                _i, _l = arr.length;

            for (_i = 0; _i < _l; _i += 1) {
                _m.push(parseFn(arr[_i], args));
            }
            return _m;
        }

        /**
         * if the namespace has a property with 'propertyName'
         *  return it, else return the 'defaultValue'
         * @param  {object} namespace    namespace to check
         * @param  {object} propertyName name of property on namespace
         * @param  {object} defaultValue default value
         * @return {object}              selected value
         */
        function defaultOption(namespace, propertyName, defaultValue) {
            if (namespace[propertyName]) {
                return namespace[propertyName];
            }
            return defaultValue;
        }

        return _service;
    }
})(angular);
