const timeTrackerApp = angular.module( 'TimeTrackerApp', [] );

timeTrackerApp.controller( 'MainController', ['$http', function ( $http ) {

    // controller setup
    console.log( 'MainController loaded!' );
    const self = this;

    // variables and stuff
    self.displayTimeEntries = [];


    // --------------------
    // CRUD Stuff
    // --------------------

    // Create
    self.addTimeEntry = function ( thingToAdd ) {

        console.log( '--- in addTimeEntry:' );
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

    // Read
    self.getTimeEntry = function () {

        console.log( '--- in getTimeEntry.' );

        $http.get( '/time' )
            .then( function ( results ) {
                console.log( '--- back from the server with:' );
                console.log( results );
                self.displayTimeEntries = results.data;
            } )
            .catch( function ( error ) {
                alert( 'There was a problem getting the Time Entries.' );
                console.log( '--- Error in getTimeEntry:' );
                console.log( error );
            } )

    }

    // initial calls
    self.getTimeEntry();

}] )