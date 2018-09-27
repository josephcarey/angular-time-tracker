const timeTrackerApp = angular.module( 'TimeTrackerApp', [] );

timeTrackerApp.controller( 'MainController', ['$http', function ( $http ) {

    console.log( 'MainController loaded!' );

    const self = this;

    self.addTimeEntry = function ( thingToAdd ) {

        console.log( 'in addTimeEntry:' );
        console.log( thingToAdd );

        $http.post( '/time', thingToAdd )
            .then( function () {
                alert( 'New Time Entry successfully added!' );
            } )
            .catch( function ( error ) {
                alert( 'There was a problem adding the new Time Entry.' );
                console.log( '--- Error in addTimeEntry:' );
                console.log( error );
            } )

    } // end self.addTimeEntry

}] )