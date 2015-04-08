(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsSubmenuItem';

    /**
     * @ngdoc directive
     * @name lsSubmenu_item
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The '<ls-submenu_item>' display an item as a submenu_item with optional edit/delete actions.
     *
     * @usage
     * <hljs lang="html">
     * <ls-submenu_item>
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
            template: '<li layout="row" flex class="ls-submenu-item">' +
                '<md-button layout="row" layout-align="start center"><span class="ls-icon ls-icon-{{::icon}}"></span>' +
                '<span>{{::label}}</span></md-button>' +
                '</li>',
            link: link
        };


        function link(scope, element, attrs) {
            scope.label = attrs.label;
            scope.icon = attrs.icon;
        }
    }
})(angular);
