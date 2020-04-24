import React from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { observer } from 'mobx-react';
import { useStores } from '../hooks/use-stores';

const FeedbackForm = observer(() => {
  const { feedbackStore } = useStores();
  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      feedbackStore.submitFeedback();
    }}
    >
      <FormGroup>
        <Label for="username">Your name:</Label>
        <Input
          id="username"
          value={feedbackStore.username}
          onChange={e => feedbackStore.setUsername(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="comments">Comments:</Label>
        <Input
          id="comments"
          type="textarea"
          value={feedbackStore.comments}
          onChange={e => feedbackStore.setComments(e.target.value)}
        />
      </FormGroup>
      <Button type="submit" color="primary">Submit</Button>
    </Form>
  );
});

export default FeedbackForm;
