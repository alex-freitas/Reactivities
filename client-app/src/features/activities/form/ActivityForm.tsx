import { create } from "domain";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/Activity";
import { useStore } from "../../../app/stores/store";

interface Props {
    // activity: Activity | undefined;
    // closeForm: () => void;
    //createOrEdit: (activity: Activity) => void;
    //submitting: boolean;
}

 function ActivityForm({ 
    // activity: selectedActivity, 
    // closeForm, 
    //createOrEdit, 
    //submitting 
}: Props) {

    const { activityStore } = useStore();
    const { selectedActivity, closeForm, createActivity, updateActivity, submitting } = activityStore;


    const initialState = selectedActivity ?? {
        id: '',
        date: '',
        city: '',
        venue: '',
        title: '',
        category: '',
        description: ''
    };

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        //console.log(activity);
        //createOrEdit(activity);

        activity.id ? updateActivity(activity) : createActivity(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        let actualState = { ...activity, [name]: value };
        //console.log(actualState);
        setActivity(actualState);
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInputChange} />
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInputChange} />
                <Form.Input placeholder='Date' name='date' value={activity.date} onChange={handleInputChange} type='date' />
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange} />
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange} />

                <Button floated='right' type='submit' content='Submit' positive loading={submitting} />                
                <Button floated='right' type='button' content='Cancel' onClick={closeForm} />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);
