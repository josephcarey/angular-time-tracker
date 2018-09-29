const timeTrackerApp = angular.module( 'TimeTrackerApp', ['ngRoute', 'ngMaterial', 'ngMessages'] );

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
        .when( '/project-overview', {
            controller: "ProjectOverviewController as vm",
            templateUrl: "../views/project-overview.html"
        } )
        .otherwise( '/', {
            templateUrl: '../views/404.html'
        } )


}] )

timeTrackerApp.controller( 'MyController', ['$mdSidenav', function ( $mdSidenav ) {
    self = this;
    self.openLeftMenu = function () {
        $mdSidenav( 'left' ).toggle();
    }
}] )