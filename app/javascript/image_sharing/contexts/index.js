import { createContext } from 'react';
import { FeedbackStore } from '../stores';

export const storesContext = createContext({
  feedbackStore: new FeedbackStore(),
});
