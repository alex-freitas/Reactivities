import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid, Header } from "semantic-ui-react";
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';

function ActivityDashboard() {
    const { activityStore } = useStore();
    const { activityRegistry, loadActivities, loadingInitial } = activityStore;

    useEffect(() => {        
        if(activityRegistry.size <= 1) {
            loadActivities();
        }
    }, [activityRegistry.size, loadActivities]);

    if (loadingInitial) return <LoadingComponent content='Loading app' />;

    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList />
            </Grid.Column>

            <Grid.Column width="6">
                <Header as="h2" content="Activity filters" />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);
