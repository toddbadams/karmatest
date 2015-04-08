(function(angular) {
    'use strict';

    var _controllerId = 'lsprojects';

    /**
     * @ngdoc module
     * @name lsprojects
     * @module ls
     * @description
     *  displays the projects page
     */
    angular.module('ls')
        .controller(_controllerId, controller);

    controller.$inject = [];

    function controller() {
        //var vm = projectService.projectsPage();
        //window.foo = vm;
        //return vm;
        //
        this.rangeSelectOptions = [{
            label: "This year",
            range: moment().range(
                moment().startOf("year").startOf("day"),
                moment().endOf("year").startOf("day")
            )
        }, {
            label: "Last year",
            range: moment().range(
                moment().startOf("year").add(-1, "year").startOf("day"),
                moment().add(-1, "year").endOf("year").startOf("day")
            )
        }];

        this.projectsBefore = [{
            id: 'fgher',
            dateCreated: moment().startOf("month").unix(),
            code: 'AF27',
            name: 'Install wiring check'
        }, {
            id: 'sdffv',
            dateCreated: moment().startOf("month").unix(),
            code: 'AF28',
            name: 'Install wiring check'
        }, {
            id: 'ukr5',
            dateCreated: moment().startOf("month").unix(),
            code: 'AF29',
            name: 'Install wiring check'
        }, {
            id: 'dfhn6',
            dateCreated: moment().startOf("month").unix(),
            code: 'AF30',
            name: 'Install wiring check'
        }];

        this.projectsAfter = [{
            id: 'fhdth7',
            dateCreated: moment().startOf("month").unix(),
            code: 'AF32',
            name: 'Install wiring check'
        }, {
            id: 'drfbb77',
            dateCreated: moment().startOf("month").unix(),
            code: 'AF33',
            name: 'Install wiring check'
        }, {
            id: 'dhn6',
            dateCreated: moment().startOf("month").unix(),
            code: 'AF89',
            name: 'Install wiring check'
        }, {
            id: 'sdrgbb6',
            dateCreated: moment().startOf("month").unix(),
            code: 'AF56',
            name: 'Install wiring check'
        }];

        this.project = {
            id: 'fgher',
            dateCreated: moment().startOf("month").unix(),
            code: 'AF27',
            name: 'Install wiring check',
            state: 'Active',
            billRate: 75,
            createdBy: 'Eddie Wang'
        };
    }
})(angular);
