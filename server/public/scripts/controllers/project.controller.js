timeTrackerApp.controller( 'ProjectController', ['$http', function ( $http ) {

    // controller setup
    console.log( 'ProjectController loaded!' );
    const self = this;

    // --------------------
    // CRUD Stuff
    // --------------------

    // Create
    self.addProject = function ( thingToAdd ) {

        console.log( '--- in addProject:' );
        console.log( thingToAdd );

        $http.post( '/project', thingToAdd )
            .then( function () {
                alert( 'New Project successfully added!' );
            } )
            .catch( function ( error ) {
                alert( 'There was a problem adding the new Project.' );
                console.log( '--- Error in addProject:' );
                console.log( error );
            } )

    }

    // Read


}] )