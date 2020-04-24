import { action, observable } from 'mobx';

import { postFeedback } from '../services/PostFeedbackService';

export class FeedbackStore {
  @observable username = '';
  @observable comments = '';

  @action setComments(comments) {
    this.comments = comments;
  }

  @action setUsername(username) {
    this.username = username;
  }

  @action submitFeedback() {
    postFeedback(this.username, this.comments)
      .then(() => console.log('successfully submitted feedback'))
      .catch(err => console.error(err));
  }
}
