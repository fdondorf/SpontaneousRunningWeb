angular.module('app.main', ['ngRoute', 'oasp.oaspUi', 'oasp.oaspSecurity', 'app.main.templates', 'oasp.oaspI18n', 'ui.bootstrap'])
    .constant('SIGN_IN_DLG_PATH', '/main/sign-in')
    .constant('REGISTER_DLG_PATH', '/main/register')
    .constant('REGISTER_SUCCESS_DLG_PATH', '/main/register-success')
    .config(function (SIGN_IN_DLG_PATH, REGISTER_DLG_PATH, REGISTER_SUCCESS_DLG_PATH, $routeProvider, oaspTranslationProvider) {
        'use strict';
        $routeProvider
            .when('/', {
                templateUrl: 'main/html/blank.html',
                controller: 'RedirectorCntl'
            })
            .when(SIGN_IN_DLG_PATH, {
                templateUrl: 'main/html/sign-in.html',
                controller: 'SignInCntl',
                resolve: {
                    check: ['homePageRedirector', function (homePageRedirector) {
                        return homePageRedirector.rejectAndRedirectToHomePageIfUserLoggedIn();
                    }]
                }
            })
            .when(REGISTER_DLG_PATH, {
                templateUrl: 'main/html/register.html',
                controller: 'RegisterCntl',
                resolve: {
                    check: ['homePageRedirector', function (homePageRedirector) {
                        return homePageRedirector.rejectAndRedirectToHomePageIfUserLoggedIn();
                    }]
                }
            })
            .when(REGISTER_SUCCESS_DLG_PATH, {
                templateUrl: 'main/html/register-success.html',
                controller: 'RegisterSuccessCntl',
                resolve: {
                    check: ['homePageRedirector', function (homePageRedirector) {
                        return homePageRedirector.rejectAndRedirectToHomePageIfUserLoggedIn();
                    }]
                }
            })
            .otherwise({templateUrl: 'main/html/page-not-found.html'});

        oaspTranslationProvider.enableTranslationForModule('main', true);
        oaspTranslationProvider.setSupportedLanguages(
            [
                {
                    key: 'en',
                    label: 'English',
                    'default': true
                },
                {
                    key: 'de',
                    label: 'German'
                }
            ]
        );
    });