(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsMenuItem';

    /**
     * @ngdoc directive
     * @name lsMenu_item
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The '<ls-menu-item>' display an item as a menu_item with optional edit/delete actions.
     *
     * @usage
     * <hljs lang="html">
     * <ls-menu-item>
     * </hljs>
     */
    angular.module(_moduleId)
        .directive(_directiveId, directive);

    directive.$inject = [];

    function directive() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            transclude: true,
            template: '<li class="li-menu-item"   data-ng-click="toggle()">' +
                '<md-button layout="row" layout-align="start center"><span  class="ls-icon ls-icon-{{::icon}}"></span>' +
                '<span>{{::label}}</span></md-button>' +
                '<ul class="ls-submenu" data-ng-transclude data-ng-show="childVisible">' +
                '</ul>' +
                '</li>',
            link: link
        };

        function link(scope, element, attrs, ngModelController) {
            scope.label = attrs.label;
            scope.icon = attrs.icon;
            scope.childVisible = false;
            scope.toggle = function() {
                hide(scope.$$nextSibling, '$$nextSibling');
                hide(scope.$$prevSibling, '$$prevSibling');
                scope.childVisible = !scope.childVisible;
            };

            function hide(siblingScope, objName) {
                if (!siblingScope) return;
                siblingScope.childVisible = false;
                hide(siblingScope[objName]);
            }

            window.menuitems.push(scope);
        }
    }
})(angular);
