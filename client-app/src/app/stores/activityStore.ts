import { makeAutoObservable, makeObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/Activity";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
    activities: Activity[] = [];
    selectedActivity?: Activity = undefined;
    editMode = false;
    submitting = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this);
    }

    setLoadingInitial = (state: boolean) => { this.loadingInitial = state; }
    setSubmitting = (state: boolean) => { this.submitting = state; }

    selectActivity = (id: string) => { this.selectedActivity = this.activities.find(x => x.id === id); }
    
    cancelSelectedActivity = () => { this.selectedActivity = undefined; }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => { this.editMode = false };

    loadActivities = async () => {
        try {
            const response = await agent.Activities.list();

            response.forEach(activity => {
                activity.date = activity.date.split('T')[0];
                this.activities.push(activity);
            });

            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    createActivity = async (newActivity: Activity) => {
        this.setSubmitting(true);
        newActivity.id = uuid();

        try {
            await agent.Activities.create(newActivity);

            runInAction(() => {
                this.activities.push(newActivity);
                this.selectedActivity = newActivity;
                this.editMode = false;
            });

            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }

    updateActivity = async (activity: Activity) => {
        this.setSubmitting(true);

        try {
            await agent.Activities.update(activity);

            runInAction(() => {
                //this.activities.filter(a => a.id !== activity.id);
                //this.activities.push(activity);

                this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                this.selectedActivity = activity;
                this.editMode = false;
            });

            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }

    deleteActivity = async (id: string) => {
        this.setSubmitting(true);

        try {
            await agent.Activities.delete(id);

            runInAction(() => {
                this.activities = [...this.activities.filter(x => x.id !== id)];

                if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
            });

            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }
}

