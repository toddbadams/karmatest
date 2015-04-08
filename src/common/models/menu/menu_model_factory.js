(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _serviceId = 'lsMenuModelFactory';

    /**
     * @ngdoc factory
     * @name lsMenuModelFactory
     * @module ls
     *
     * @description
     * Creates a navigation menu model.
     *
     */
    angular.module(_moduleId)
        .factory(_serviceId, factory);

    factory.$inject = ['lsModelsBase'];

    function factory(lsModels) {
        var _service = {
            createFromRoute: createFromRoute,
            createFromAction: createFromAction
        };

        function createFromRoute(data, id) {
            var _m = new Menu();
            _m.parseRoutes(data, id);
            return _m;
        }

        function createFromAction(data, id) {
            var _m = new Menu();
            _m.parseRoutes(data, id);
            return _m;
        }

        /**
         *  Menu Item
         */
        function MenuItem() {
            this.order = 0;
            this.label = '';
            this.url = '';
            this.tooltip = '';
            this.icon = '';
            this.action = '';
            this.siblings = [];
            this.child = null;
            this.toggleChildOnClick = false;
            this.toggleSiblingOnClick = false;
        }

        MenuItem.prototype.parseRoute = function(data) {
            this.order = data.config.nav.order;
            this.label = data.config.nav.label;
            this.url = '/#' + data.path;
            this.tooltip = data.config.nav.tooltip;
        };


        MenuItem.prototype.parseActions = function(data) {
            this.order = data.order;
            this.label = data.label;
            this.action = data.action;
            this.icon = data.icon;
            this.tooltip = data.tooltip;
        };

        /**
         *  Navigation Menu
         */
        function Menu() {
            this.id = '';
            this.items = [];
        }

        Menu.prototype.parseRoutes = function(arr, id) {
            var _i,
                _l = arr.length;

            this.id = id;
            this.items = [];
            for (_i = 0; _i < _l; _i += 1) {
                if (arr[_i].config &&
                    arr[_i].config.nav &&
                    arr[_i].config.nav.nav === id) {
                    var _item = new MenuItem();
                    _item.parseRoute(arr[_i]);
                    this.items.push(_item);
                }
            }
            return this;
        };


        Menu.prototype.parseActions = function(arr, id) {
            var _i,
                _l = arr.length;

            this.id = id;
            this.items = [];
            for (_i = 0; _i < _l; _i += 1) {
                if (arr[_i].config &&
                    arr[_i].config.nav &&
                    arr[_i].config.nav.nav === id) {
                    this.items.push(lsModels.createModel(arr[_i], MenuItem, MenuItem.parseRoute));
                }
            }
            return this;
        };


        return _service;
    }
})(angular);
