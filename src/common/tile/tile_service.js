(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _serviceId = 'lsTileService';

    /**
     * @ngdoc factory
     * @name lsTileService
     * @module ls
     *
     * @description
     * A service for tile functionality
     *
     */
    angular.module(_moduleId)
        .factory(_serviceId, factory);

    factory.$inject = ['$window'];

    function factory($window) {
        var _service = {
            compile: compile,
            link: link,
            positionTiles: positionTiles,
            getFromParentScope: getFromParentScope
        };

        /**
         * edit the dom element for a tile grid, and add the child tile element
         *  and the child selected element
         * @param  {Element} element The DOM element to alter
         * @param  {Array} attrs   An array of attributes on the DOM element
         * @return {function}         A link function which links the scope (namespace) to an element
         */
        function compile(element, attrs) {
            var _el = element[0],
                _child = document.createElement(attrs.tile),
                _selected = document.createElement(attrs.detail);

            _child.setAttribute('data-ng-repeat', 'item in tileItems');
            _child.setAttribute('data-ng-click', 'click(item)');
            _child.classList.add('ls-tile');
            _selected.classList.add('ls-tile-selected');
            _el.classList.add('ls-tile-grid');
            _el.setAttribute('data-ng-show', 'tileVisble');
            _el.appendChild(_child);
            _el.appendChild(_selected);

            return link;
        }

        function link(scope, element, attrs) {
            // the height of the selected tile
            var _height = parseInt(attrs.detailHeight);
            // hide for now
            scope.tileVisble = false;
            // get our items for the tiles
            scope.tileItems = getFromParentScope(scope, attrs.tiles);
            // selected tile index
            scope.tileSelectedIndex = 0;
            // when we have items position them
            scope.$watch('tileItems', function() {
                positionTiles(scope.tileSelectedIndex, _height, scope,  element);
            });
            // click on tile dom element event handler
            scope.click = function(item) {
                scope.tileSelectedIndex = item.index;
                positionTiles(scope.tileSelectedIndex, _height, scope,  element);
            };
            // position tiles on window resize;
            $window.onresize = function() {
                positionTiles(scope.tileSelectedIndex, _height, scope,  element);
            };
        }


        function positionTiles(selectedIndex, height, scope, element) {
            var
                _i,
                _tileMargin = 10,
                _tileWidth = 180,
                _parentWidth = element[0].parentElement.offsetWidth,
                _children = element[0].children,
                _l = _children.length,
                _itemsPerRow = Math.floor((_parentWidth - _tileMargin) / (_tileWidth + _tileMargin)),
                _rowPixelWidth = _itemsPerRow * (_tileWidth + _tileMargin) - _tileMargin;

            // loop through all child element and position, based upon parent dom element width;
            for (_i = 0; _i < _l - 1; _i += 1) {
                var _col = _i % _itemsPerRow,
                    _row = Math.floor(_i / _itemsPerRow),
                    _selectedRow = Math.floor(selectedIndex / _itemsPerRow),
                    _x = Math.floor(_tileMargin + (_tileMargin + _tileWidth) * _col),
                    _y = Math.floor(_tileMargin + (_tileMargin + _tileWidth) * _row) +
                    (_row > _selectedRow ? height + _tileMargin : 0),
                    _style = 'left:' + _x + 'px; top:' + _y + 'px;';

                if (_i === selectedIndex) {
                    _children[_i].classList.add('ls-tile-selected');
                    positionSelected(_children[_children.length - 1], _rowPixelWidth, height, _tileMargin, _tileWidth, _y);
                } else {
                    _children[_i].classList.remove('ls-tile-selected');
                }
                _children[_i].setAttribute('style', _style);
                scope.tileItems[_i].index = _i;
            }
            scope.tileVisble = true;
        }

        function positionSelected(el, width, height, margin, tileWidth, y) {
            var
                _selectedStyle = 'left:' + margin + 'px; top:' + (y + tileWidth + margin) + 'px;' +
                ' width:' + width + 'px; height:' + height + 'px;';
            el.setAttribute('style', _selectedStyle);
        }

        /**
         * gets an object on a namespace
         * @param  {object} namespace the namespace to look for the object
         * @param  {string} name   the property name of the object
         * @return {object]}             the object found
         */
        function getFromParentScope(namespace, name) {
            var _arr = name.split('.'),
                _i, _l = _arr.length,
                _result = namespace;
            for (_i = 0; _i < _l; _i += 1) {
                _result = _result[_arr[_i]];
            }
            return _result;
        }

        return _service;
    }
})(angular);
