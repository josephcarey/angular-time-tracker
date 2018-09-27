const timeTrackerApp = angular.module( 'TimeTrackerApp', ['ngRoute'] );

timeTrackerApp.config( ['$routeProvider', function ( $routeProvider ) {

    $routeProvider
        .when( '/', {
            redirectTo: '/time'
        } )
        .when( '/time', {
            controller: "TimeController as vm",
            templateUrl: "../views/time.html"
        } )
        .when( '/project', {
            controller: "ProjectController as vm",
            templateUrl: "../views/project.html"
        } )
        .otherwise( '/', {
            templateUrl: '../views/404.html'
        } )


}] )