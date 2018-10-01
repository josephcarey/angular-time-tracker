timeTrackerApp.controller( 'TimeController', ['$http', '$mdToast', '$mdDialog', function ( $http, $mdToast, $mdDialog ) {

    // controller setup
    console.log( 'TimeController loaded!' );
    const self = this;

    // variables and stuff
    self.displayTimeEntries = [];
    self.displayProjects = [];
    self.optionsProjects = [];


    // test out making a modal pop up for adding a new time entry

    self.openInputDialog = function () {
        console.log( 'clicked!' );

    }

    // --------------------
    // Time CRUD Stuff
    // --------------------

    // Create
    self.addTimeEntry = function ( thingToAdd ) {

        console.log( '--- in addTimeEntry:' );
        console.log( thingToAdd );

        thingToAdd.start_time = thingToAdd.startTime;
        thingToAdd.end_time = thingToAdd.endTime;

        $http.post( '/time', thingToAdd )
            .then( function () {
                $mdToast.show( $mdToast.simple().textContent( 'New Time Entry created!' ) );
                self.getTimeEntry();
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem adding a Time Entry.' ) );
                console.log( '--- Error in addTimeEntry:' );
                console.log( error );
            } )

        $mdDialog.hide();

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
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem getting the Time Entries.' ) );
                console.log( '--- Error in getTimeEntry:' );
                console.log( error );
            } )

    }


    // Update
    self.stageEditTime = function ( timeToPutInEdit ) {

        console.log( 'in stage edit time' );


        self.timeToEdit = timeToPutInEdit;

        $mdDialog.show( {
            contentElement: '#editTimeDialog',
            parent: angular.element( document.body ),
            clickOutsideToClose: true,
            bindToController: true
        } )


    }

    self.editTime = function ( timeToEdit ) {

        $http.put( `/time/${timeToEdit.id}`, timeToEdit )
            .then( function () {
                self.navigateToProject( self.currentProject );
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem editing the time.' ) );
                console.log( '--- Error in editTime:' );
                console.log( error );
            } )

    }

    // Delete
    self.deleteTime = function ( thingToDelete ) {

        console.log( '--- in deleteTimeEntry:' );
        console.log( thingToDelete );

        let confirm = $mdDialog.confirm()
            .title( 'Confirm Delete' )
            .textContent( `Are you sure you want to delete this time entry?` )
            .ok( 'Delete' )
            .cancel( 'Cancel' );

        // ask if they're sure
        $mdDialog.show( confirm )

            .then( function () {

                $http.delete( `/time/${thingToDelete.id}` )
                    .then( function () {
                        $mdToast.show( $mdToast.simple().textContent( 'Time Entry successfully deleted!' ) );
                        self.getTimeEntry();
                    } )
                    .catch( function ( error ) {
                        $mdToast.show( $mdToast.simple().textContent( 'There was a problem deleting the Time Entry.' ) );
                        console.log( '--- Error in deleteTimeEntry:' );
                        console.log( error );
                    } )

            } )

            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'Delete canceled.' ) );
            } )

    }


    // --------------------
    // Project CRUD stuff
    // --------------------

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
                console.log( '--- Error in getProject:' );
                console.log( error );
            } )

    }

    self.stageEditProject = function ( projectToPutInEdit ) {

        self.projectToEdit = projectToPutInEdit;

        $mdDialog.show( {
            contentElement: '#editProjectDialog',
            parent: angular.element( document.body ),
            clickOutsideToClose: true,
            bindToController: true
        } )


    }

    self.editProject = function ( projectToEdit ) {

        $http.put( `/project/${projectToEdit.id}`, projectToEdit )
            .then( function () {
                self.navigateToProject( self.currentProject );
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem editing the project.' ) );
                console.log( '--- Error in editProject:' );
                console.log( error );
            } )

    }

    self.deleteProject = function ( thingToDelete ) {

        console.log( '--- in deleteProject:' );
        console.log( thingToDelete );

        let confirm = $mdDialog.confirm()
            .title( 'Confirm Delete' )
            .textContent( `Are you sure you want to delete this project?` )
            .ok( 'Delete' )
            .cancel( 'Cancel' );

        // ask if they're sure
        $mdDialog.show( confirm )

            .then( function () {

                $http.delete( `/project/${thingToDelete.id}` )
                    .then( function () {
                        $mdToast.show( $mdToast.simple().textContent( 'Project successfully deleted!' ) );
                        self.navigateToProject( self.currentProject );
                    } )
                    .catch( function ( error ) {
                        $mdToast.show( $mdToast.simple().textContent( 'There was a problem deleting the Project.' ) );
                        console.log( '--- Error in deleteProject:' );
                        console.log( error );
                    } )

            } )

            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'Delete canceled.' ) );
            } )
    }

    // --------------------
    // Other
    // --------------------

    self.closeMe = function () {
        $mdDialog.hide();
    }

    // initial calls
    self.getTimeEntry();
    self.getProject();

}] )