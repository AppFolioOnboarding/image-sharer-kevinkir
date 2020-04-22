import { action, observable } from 'mobx';

export class FeedbackStore {
  @observable username = '';
  @observable comments = '';

  @action setComments(comments) {
    this.comments = comments;
  }

  @action setUsername(username) {
    this.username = username;
  }
}
