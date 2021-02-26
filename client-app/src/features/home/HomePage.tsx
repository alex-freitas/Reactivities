import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';

export default function HomePage() {
    return (
        <Segment textAlign="center" className="masthead" inverted vertical>
            <Container text>
                <Header as="h1" inverted>
                    <Image src="/assets/logo.png" alt="logo" size="massive"
                        style={{ marginBotton: 12 }} />
                    Reactivities
                </Header>
                <Header as="h2" content="Welcome to Reactivities" inverted />
                <Button as={Link} to="/activities" size="huge" inverted>Take me the Activities</Button>
            </Container>
        </Segment>
    );
}
