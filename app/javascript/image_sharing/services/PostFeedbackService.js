import { post } from '../utils/helper';

export function postFeedback(username, comments) {
  return post('/api/feedbacks', { username, comments });
}
