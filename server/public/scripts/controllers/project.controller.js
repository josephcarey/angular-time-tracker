timeTrackerApp.controller( 'ProjectController', ['$http', '$mdToast', '$mdDialog', function ( $http, $mdToast, $mdDialog ) {

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

        let confirm = $mdDialog.confirm()
            .title( 'Confirm Delete' )
            .textContent( `Are you sure you want to delete this project?` )
            .ok( 'Delete' )
            .cancel( 'Cancel' )

        // ask if they're sure
        $mdDialog.show( confirm )
            .then( function () {

                if ( thingToDelete.number_of_entries < 1 ) {

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
                else {

                    // Don't allow project to be deleted when it has time_entries
                    // other behaviors could be delete all the things or orphan them.
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose( true )
                            .title( 'Oops!' )
                            .textContent( `You can't delete a project while it has times that belong to it.` )
                            .ok( 'Okay' )
                    )
                }
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'Delete canceled.' ) );
            } )

        //     let confirm = $mdDialog.confirm()
        //     .title( 'Confirm Delete' )
        //     .textContent( `Are you sure you want to destroy this ship?` )
        //     .ok( 'Open fire!' )
        //     .cancel( 'Let them live. For now.' );

        // // ask if they're sure
        // $mdDialog.show( confirm )
        //     .then( function ( e ) {
        //         console.log( 'in .then! e:', e );


        //         if ( ship.current_crew > 0 ) {
        //             $mdDialog.show(
        //                 $mdDialog.alert()
        //                     .clickOutsideToClose( true )
        //                     .title( 'Warning!' )
        //                     .textContent( `You can't delete a ship while it still has crew!` )
        //                     .ok( 'Aye-aye cap\'n!' )
        //             )

        //         } else {
        //             // Delete an existing ship, must have no crew!
        //             $http( {
        //                 method: 'DELETE',
        //                 url: `/ships/${ship.id}`
        //             } ).then( ( response ) => {
        //                 self.getShips();
        //                 $mdToast.show( $mdToast.simple().textContent( 'Ship successfully destroyed. They\'re nothing but flotsam now.' ) );
        //             } ).catch( ( error ) => {
        //                 console.log( 'error making rent get request', error );
        //                 $mdToast.show( $mdToast.simple().textContent( 'Something went wrong! Check the server.' ) );
        //             } );
        //         }
        //     } )
        //     .catch( function ( e ) {
        //         console.log( 'in .catch! e:', e );
        //     } )


    }

    // initial calls
    self.getProject();

}] )