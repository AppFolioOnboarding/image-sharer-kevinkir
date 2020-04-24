import { action, observable } from 'mobx';

import { postFeedback } from '../services/PostFeedbackService';
import { redirectToRoot } from '../services/Router';

export class FeedbackStore {
  @observable username = '';
  @observable comments = '';
  @observable errors = {
    comments: null,
    username: null,
  };

  @action setComments(comments) {
    this.comments = comments;
  }

  @action setUsername(username) {
    this.username = username;
  }

  @action.bound clearErrors() {
    this.errors = {
      comments: null,
      username: null,
    };
  }

  @action submitFeedback() {
    return postFeedback(this.username, this.comments)
      .finally(this.clearErrors)
      .then(redirectToRoot)
      .catch(this.handleError);
  }

  @action.bound handleError(err) {
    if (err && err.data && err.data.errors) {
      err.data.errors.forEach(({ source, title }) => {
        this.errors[source.parameter] = title;
      });
    } else {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}
