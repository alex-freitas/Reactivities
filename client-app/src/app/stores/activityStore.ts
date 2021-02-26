import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";


export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity?: Activity = undefined;
    editMode = false;
    submitting = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this);
    }

    get activities() {
        const arr = Array.from(this.activityRegistry.values());
        return arr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    get groupedActivities() {   
        const initialValue = {} as { [key: string]: Activity[] };
        //console.log('Initial Value', initialValue);

        const reduced = this.activities/*.slice(0, 3)*/.reduce((accumulator, currentValue) => {
            //console.log('Accumulator', accumulator);
            //console.log('Current Value', typeof(currentValue), currentValue, currentValue.id);

            const date = currentValue.date;
            accumulator[date] = accumulator[date] ? [...accumulator[date], currentValue] : [currentValue];
            return accumulator;
        }, {} as { [key: string]: Activity[] });

        //console.log('Reduced', reduced);

        const objectEntries =  Object.entries(reduced);

        //console.log('Object.Entries', objectEntries);

        return objectEntries;
    }

    setLoadingInitial = (state: boolean) => { this.loadingInitial = state; }
    setSubmitting = (state: boolean) => { this.submitting = state; }

    loadActivities = async () => {
        this.setLoadingInitial(true);

        try {
            const response = await agent.Activities.list();

            response.forEach(activity => {
                this.setActivity(activity);
            });

            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        this.setLoadingInitial(true);

        let activity = this.getActivity(id);

        if (activity) {
            this.selectedActivity = activity;
            this.setLoadingInitial(false);
            return activity;
        }

        try {
            activity = await agent.Activities.details(id);
            this.setActivity(activity);
            runInAction(() => {
                this.selectedActivity = activity;
            });
            this.setLoadingInitial(false);
            return activity;
        } catch (error) {
            console.log('loadActivity', error);
            this.setLoadingInitial(false);
        }
    }

    createActivity = async (newActivity: Activity) => {
        this.setSubmitting(true);

        try {
            await agent.Activities.create(newActivity);

            runInAction(() => {
                this.activityRegistry.set(newActivity.id, newActivity);
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
                //this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                this.activityRegistry.set(activity.id, activity);
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
                this.activityRegistry.delete(id);
            });

            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }

    private getActivity = (id: string) => this.activityRegistry.get(id);

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }
}
