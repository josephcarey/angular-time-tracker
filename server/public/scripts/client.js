const timeTrackerApp = angular.module( 'TimeTrackerApp', [] );

timeTrackerApp.controller( 'MainController', [function () {

    console.log( 'MainController loaded!' );

    const self = this;

    self.addTimeEntry = function ( thingToAdd ) {

        console.log( 'in addTimeEntry:' );
        console.log( thingToAdd );


    } // end self.addTimeEntry

}] )