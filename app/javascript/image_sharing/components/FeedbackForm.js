import React from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
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
          invalid={!!feedbackStore.errors.username}
        />
        <FormFeedback className="js-username-error">{feedbackStore.errors.username}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label for="comments">Comments:</Label>
        <Input
          id="comments"
          type="textarea"
          value={feedbackStore.comments}
          onChange={e => feedbackStore.setComments(e.target.value)}
          invalid={!!feedbackStore.errors.comments}
        />
        <FormFeedback className="js-comments-error">{feedbackStore.errors.comments}</FormFeedback>
      </FormGroup>
      <Button type="submit" color="primary">Submit</Button>
    </Form>
  );
});

export default FeedbackForm;
