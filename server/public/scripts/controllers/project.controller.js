timeTrackerApp.controller( 'ProjectController', ['$http', function ( $http ) {

    // controller setup
    console.log( 'ProjectController loaded!' );
    const self = this;

    // variables and stuff
    self.displayProjects = [];


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
                self.getProject();
            } )
            .catch( function ( error ) {
                alert( 'There was a problem adding the new Project.' );
                console.log( '--- Error in addProject:' );
                console.log( error );
            } )

    }

    // Read
    self.getProject = function () {

        console.log( '--- in getProject.' );

        $http.get( '/project' )
            .then( function ( results ) {
                console.log( '--- back from the server with:' );
                console.log( results );
                self.displayProjects = results.data;
            } )
            .catch( function ( error ) {
                alert( 'There was a problem getting the Projects.' );
                console.log( '--- Error in getProjects:' );
                console.log( error );
            } )

    }

    // Update

    // Delete
    self.deleteProject = function ( thingToDelete ) {

        console.log( '--- in deleteProject:' );
        console.log( thingToDelete );

        $http.delete( `/project/${thingToDelete.id}` )
            .then( function () {
                alert( 'Project successfully deleted!' );
                self.getProject();
            } )
            .catch( function ( error ) {
                alert( 'There was a problem deleting the Project.' );
                console.log( '--- Error in deleteProject:' );
                console.log( error );
            } )

    }

    // initial calls
    self.getProject();

}] )