import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from 'uuid';

function ActivityForm() {
    const history = useHistory();
    const { activityStore } = useStore();
    const { createActivity, updateActivity, submitting, loadActivity, loadingInitial } = activityStore;

    const { id } = useParams<{ id: string }>();

    const [activity, setActivity] = useState({
        id: '',
        date: '',
        city: '',
        venue: '',
        title: '',
        category: '',
        description: ''
    });

    useEffect(() => {
        id && loadActivity(id).then((activity) => setActivity(activity!));
    }, [id, loadActivity]);
    //TODO: TESTAR SEM AS DEPENDENCIAS

    function handleSubmit() {
        if (activity.id.length === 0) {
            let newActivity = {...activity, id: uuid()};
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`)); 
        } else {             
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        };
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        let actualState = { ...activity, [name]: value };
        setActivity(actualState);
    }

    if (loadingInitial) return <LoadingComponent />

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
                <Button floated='right' type='button' content='Cancel' 
                    as={Link} to='/activities'/>
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);
