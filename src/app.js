(function() {
    var _ls = angular.module('ls', [
            // Angular modules
            'ngAnimate', // animations
            'ngRoute', // routing
            //'ngSanitize',      // sanitizes html bindings (ex: sidebar.js)

            // restangular https://github.com/mgonto/restangular
            // 'restangular',

            // Angular Local Storage https://github.com/grevory/angular-local-storage
            // 'LocalStorageModule',

            // Angular Material https://material.angularjs.org
            'ngMaterial',
            'ngMessages'

            // Angular date range picker  https://github.com/monterail/angular-date-range-picker.git
            // uses bind once
            // 'dateRangePicker',

            // Bindonce - Zero watches binding for AngularJs
            // https://github.com/Pasvaz/bindonce
            //'pasvaz.bindonce'
        ]),

        /**
         * Static application settings
         * @type {Object}
         */
        _settings = {
            routes: [{
                path: '/',
                route: {
                    templateUrl: 'src/dashboard/dashboard.html',
                    controller: 'lsdashboard',
                    controllerAs: 'dashboard'
                },
                config: {
                    pageTitle: 'Dashboard',
                    nav: {
                        order: 1,
                        nav: 'main',
                        label: 'Dashboard',
                        tooltip: 'view my dashboard'
                    }
                }
            }, {
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
            }, {
                path: '/appointments',
                route: {
                    templateUrl: 'src/appts/appointments.html',
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
            }, {
                path: '/scheduler',
                route: {
                    templateUrl: 'src/scheduler/scheduler.html',
                    controller: 'lsscheduler',
                    controllerAs: 'vm'
                },
                config: {
                    pageTitle: 'Scheduler',
                    nav: {
                        order: 3,
                        nav: 'main',
                        label: 'Scheduler',
                        tooltip: 'team scheduler'
                    }
                }
            }, {
                path: '/reports',
                route: {
                    templateUrl: 'src/reports/reports.html',
                    controller: 'lsreports',
                    controllerAs: 'vm'
                },
                config: {
                    pageTitle: 'Reports',
                    nav: {
                        order: 4,
                        nav: 'main',
                        label: 'Reports',
                        tooltip: 'view reports'
                    }
                }
            }, {
                path: '/login',
                route: {
                    templateUrl: '/app/user/views/login.html',
                    controller: 'lslogin',
                },
                config: {
                    pageTitle: 'login title'
                }
            }, {
                path: '/forgotpassword',
                route: {
                    templateUrl: '/app/user/views/forgotpassword.html',
                    controller: 'lsforgotpassword'
                },
                config: {
                    pageTitle: 'forgot password title'
                }
            }, {
                path: '/logout',
                route: {
                    templateUrl: '/app/user/views/logout.html',
                    controller: 'lslogout',
                },
                config: {
                    pageTitle: 'logout title'
                }
            }, {
                path: '/profile',
                route: {
                    templateUrl: '/src/profile/profile.html',
                    controller: 'lsprofile',
                },
                config: {
                    pageTitle: 'User Profile'
                }
            }],
            appointmentActions: [{
                label: 'Customer Contact',
                tooltip: 'SMS, email of phone the customer',
                icon: 'phone',
                children: [{
                    label: 'Send SMS update',
                    tooltip: 'sms the customer',
                    icon: 'sms="{{id}}"',
                    action: 'ls-sms-user'
                }, {
                    label: 'Send email update',
                    tooltip: 'email the customer',
                    icon: 'email="{{id}}"',
                    action: 'ls-email-user'
                }, {
                    label: '{{mobileFormatted}}',
                    tooltip: 'call the customer',
                    icon: 'phone',
                    action: 'ls-call-user="{{id}}'
                }],
                toggleChildOnClick: true,
                toggleSiblingOnClick: true
            }, {
                label: 'Status',
                tooltip: 'change the status of this appointment',
                icon: 'status',
                children: [{
                    label: 'On route',
                    tooltip: 'on route to customer site',
                    icon: 'onroute',
                    action: 'ls-appointment-onroute="{{status}}"'
                }, {
                    label: 'Start',
                    tooltip: '',
                    icon: 'start',
                    action: 'ls-appointment-start="{{status}}"'
                }, {
                    label: 'Complete',
                    tooltip: '',
                    icon: 'complete',
                    action: 'ls-appointment-complete="{{status}}"'
                }, {
                    label: 'Place on hold',
                    tooltip: '',
                    icon: 'hold',
                    action: 'ls-appointment-hold="{{status}}"',
                    children: []
                }],
                toggleChildOnClick: true,
                toggleSiblingOnClick: true
            }, {
                label: 'Share',
                tooltip: 'share this appointment with others',
                icon: 'alarm',
                action: '',
                children: [{
                    label: 'by email',
                    tooltip: 'email a link to this appointment',
                    icon: 'email',
                    action: 'ls-appointment-email="{{id}}"'
                }, {
                    label: 'by SMS',
                    tooltip: 'SMS a link to this appointment',
                    icon: 'sms',
                    action: 'ls-appointment-sms="{{id}}"'
                }],
                toggleChildOnClick: true,
                toggleSiblingOnClick: true
            }],

            serviceBase: 'http://localhost:26264/',
            clientId: 'ngAuthApp',

            enableToaster: true,
            toastr: {
                timeOut: 4000,
                positionClass: 'toast-bottom-right'
            },
            errorPrefix: 'Error ',
            debugEnabled: true,

            events: {
                controllerActivate: 'controller.activate',
                controllerActivateSuccess: 'controller.activate.success',
                controllerActivateError: 'controller.activate.error',
                spinnerToggle: 'spinner.toggle',
                spinnerOn: 'spinner.on',
                spinnerOff: 'spinner.off'
            },

            brand: 'Scheduler',
            version: '1.0.1',
            busyMessage: 'loading ...',

            spinnerOptions: {
                radius: 40,
                lines: 7,
                length: 0,
                width: 30,
                speed: 1.7,
                corners: 1.0,
                trail: 100,
                color: '#FAFAFA'
            },

            enableExecptionHandler: false
        };

    // some constants
    //angular.module('ls').constant('ngAuthSettings', {
    //    apiServiceBaseUri: _settings.serviceBase,
    //    clientId: 'ngAuthApp'
    //});
    _ls.constant('settings', _settings);

    //angular.module('app')
    //   .config(['$logProvider', 'settings', logProvider]);

    //function logProvider($logProvider, settings) {
    //    // turn debugging off/on (no info or warn)
    //    if ($logProvider.debugEnabled) {
    //        $logProvider.debugEnabled(settings.debugEnabled);
    //    }
    //}

    /********************************************************************/
    /*    Configure the routes and route resolvers                      */
    /********************************************************************/
    _ls.config(['$routeProvider', routeConfigurator]);

    function routeConfigurator($routeProvider) {
        _settings.routes.forEach(function(r) {
            $routeProvider.when(r.path, r.route);
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }

    //angular.module('ls').config(httpProvider );
    //function httpProvider($httpProvider) {
    //    $httpProvider.interceptors.push('authInterceptorService');
    //}

    //angular.module('ls').run(['authService', authServiceRunner]);
    //function authServiceRunner(authService) {
    //    authService.fillAuthData();
    //}

    // start the router
    _ls.run(['$route', routeRunner]);

    function routeRunner($route) {}

    //// configure restangular
    //angular.module('ls').run(['Restangular', 'ls.core.requestInterceptor', restangularRunner]);
    //function restangularRunner(restangular, interceptor) {
    //    restangular.setBaseUrl(_settings.serviceBase);
    //    restangular.addFullRequestInterceptor(interceptor.request);
    //    restangular.setErrorInterceptor(interceptor.error);
    //}

    //// file upload
    //angular.module('ls')
    //    .config(['flowFactoryProvider', flowFactory]);

    //function flowFactory(flowFactoryProvider) {
    //    flowFactoryProvider.defaults = {
    //        target: 'upload',
    //        permanentErrors: [404, 500, 501],
    //        maxChunkRetries: 1,
    //        chunkRetryInterval: 5000,
    //        simultaneousUploads: 4,
    //        singleFile: true
    //    };
    //    flowFactoryProvider.on('catchAll', function (event) {
    //        console.log('catchAll', arguments);
    //    });
    //    // Can be used with different implementations of Flow.js
    //    // flowFactoryProvider.factory = fustyFlowFactory;
    //}

    //// extend the exception handler
    //if (_settings.enableExecptionHandler) {
    //    $provide.decorator('$exceptionHandler', ['$delegate', extendExceptionHandler]);
    //}

    /**

     */


})();
