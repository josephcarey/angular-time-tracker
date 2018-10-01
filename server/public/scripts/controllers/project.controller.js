timeTrackerApp.controller( 'ProjectController', ['$http', '$mdToast', '$mdDialog', function ( $http, $mdToast, $mdDialog ) {

    // controller setup
    const self = this;

    // variables and stuff
    self.displayProjects = [];
    self.projectToAdd = {};
    self.projectToEdit = {};
    self.timeToEdit = {};
    self.timeToDelete = {};
    self.currentSending = false;

    // navigation stuff
    self.currentProject = 0;
    self.parentProject = 0;


    // --------------------
    // Time CRUD
    // --------------------

    self.addTime = function ( projectID ) {

        // crude gate for making sure we don't submit two sometimes when we click
        if ( !self.currentlySending ) {

            self.currentlySending = true;

            // send the project_id for initing the time entry in this project
            $http.post( '/time', { project_id: projectID } )
                .then( function () {
                    self.navigateToProject( self.currentProject );
                    self.currentlySending = false;
                } )
                .catch( function ( error ) {
                    $mdToast.show( $mdToast.simple().textContent( 'There was a problem adding a new time to this project.' ) );
                    console.log( '--- Error in addTime:' );
                    console.log( error );
                } )

        }
    }

    self.stopTime = function ( timeEntryID ) {

        // updates to the stop whack just do a NOW() in SQL to the end_time
        $http.put( `/time/stop/${timeEntryID}`, {} )
            .then( function () {
                self.navigateToProject( self.currentProject );
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem stopping the time.' ) );
                console.log( '--- Error in stopTime:' );
                console.log( error );
            } )

    }

    // prep to be edited in the modal
    self.stageEditTime = function ( timeToPutInEdit ) {

        self.timeToEdit = timeToPutInEdit;

        $mdDialog.show( {
            contentElement: '#editTimeDialog',
            parent: angular.element( document.body ),
            clickOutsideToClose: true,
            bindToController: true
        } )


    }

    // do the actual edit
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

    // delete
    self.deleteTime = function ( thingToDelete ) {

        console.log( '--- in deleteTime:' );
        console.log( thingToDelete );

        // set up the delete message
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
                        self.navigateToProject( self.currentProject );
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
    // Project CRUD
    // --------------------

    self.stageAddProject = function ( idIn ) {

        console.log( 'in stageAddProject' );

        if ( idIn != undefined ) {
            self.projectToAdd.parent_id = idIn;
        }

        $mdDialog.show( {
            contentElement: '#addProjectDialog',
            parent: angular.element( document.body ),
            clickOutsideToClose: true,
            bindToController: true
        } )
    }

    self.addProject = function ( thingToAdd ) {
        console.log( 'in addProject' );

        $http.post( '/project', thingToAdd )
            .then( function () {
                self.navigateToProject( self.currentProject );
            } )
            .catch( function ( error ) {
                $mdToast.show( $mdToast.simple().textContent( 'There was a problem adding a new project.' ) );
                console.log( '--- Error in addProject:' );
                console.log( error );
            } )

    }

    self.navigateToProject = function ( destinationProject ) {

        console.log( 'destination project:', destinationProject );
        console.log( 'current project:', self.currentProject )


        if ( destinationProject == 0 ) {

            $http.get( `/project/special/` )

                .then( function ( results ) {
                    self.displayProjects = results.data;
                    console.log( self.displayProjects );

                    self.currentProject = destinationProject;
                    self.parentProject = 0;
                } )
                .catch( function ( error ) {
                    $mdToast.show( $mdToast.simple().textContent( 'There was a problem getting the projects.' ) );
                    console.log( '--- Error in getProjects:' );
                    console.log( error );
                } )

        } else {

            $http.get( `/project/special/${destinationProject}` )

                .then( function ( results ) {
                    self.displayProjects = results.data;
                    self.currentProject = destinationProject;
                    self.parentProject = self.displayProjects[0].parent_id || 0;
                } )
                .catch( function ( error ) {
                    $mdToast.show( $mdToast.simple().textContent( 'There was a problem getting the projects.' ) );
                    console.log( '--- Error in getProjects:' );
                    console.log( error );
                    self.navigateToProject( 0 );
                } )

        }
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
    self.navigateToProject( 0 );

}] )