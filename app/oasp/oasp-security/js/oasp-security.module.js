angular.module('oasp.oaspSecurity', [])
    .config(function ($httpProvider) {
        'use strict';
        $httpProvider.interceptors.push('oaspSecurityInterceptor');
    })
    .run(function ($rootScope, $sce, $window, oaspSecurityService) {
        'use strict';
        oaspSecurityService.checkIfUserIsLoggedInAndIfSoReinitializeAppContext();
        
        /* Facebook Login */
        $rootScope.user = {};
        
        $window.fbAsyncInit = function() {
            FB.init({
            appId      : '1684459038502037',
            xfbml      : true,
            cookie     : true,
            channelUrl: 'app/channel.html', 
            version    : 'v2.5'
            });
        
            oaspSecurityService.watchLoginChange();
        
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
         
    });
