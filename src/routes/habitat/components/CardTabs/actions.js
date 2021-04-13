import { SET_CARDS_LOADING, SET_HABITAT_CARDS, SET_HABITAT_TAB } from './types';

export const setCards = (cards) => ({
  type: SET_HABITAT_CARDS,
  payload: { cards },
});

export const setActiveTab = (activeTab) => ({
  type: SET_HABITAT_TAB,
  payload: { activeTab },
});

export const setLoading = (loading) => ({
  type: SET_CARDS_LOADING,
  payload: { loading },
});
