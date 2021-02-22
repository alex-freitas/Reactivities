import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';

export default function HomePage() {
    return(
        <Container style={{marginTop: '7em'}}>
            <Header as="h1" content="Home page" />
            <Header as="h3">Go to  <Link to='/activities'>Activities</Link></Header>
        </Container>
    );
}
