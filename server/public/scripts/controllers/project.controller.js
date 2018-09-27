timeTrackerApp.controller( 'ProjectController', ['$http', '$mdToast', function ( $http, $mdToast ) {

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
                $mdToast.show( $mdToast.simple().textContent( 'New project created!' ) );
                self.getProject();
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem adding a project.' ) );
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
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem getting the projects.' ) );
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
                $mdToast.show( $mdToast.simple().textContent( 'Project successfully deleted!' ) );
                self.getProject();
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem deleting the project.' ) );
                console.log( '--- Error in deleteProject:' );
                console.log( error );
            } )

    }

    // initial calls
    self.getProject();

}] )