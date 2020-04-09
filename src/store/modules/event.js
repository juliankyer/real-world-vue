import EventService from '@/services/EventService.js';

export const namespaced = true;

export const state = {
  events: [],
  event: {},
  totalEvents: 0,
};

export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event);
  },
  SET_EVENTS(state, events) {
    state.events = events;
  },
  SET_EVENT(state, event) {
    state.event = event;
  },
  SET_TOTAL_EVENTS(state, num) {
    state.totalEvents = num;
  },
};

export const actions = {
  createEvent({ commit, dispatch }, event) {
    return EventService.postEvent(event)
      .then(() => {
        commit('ADD_EVENT', event);

        const notification = {
          type: 'success',
          message: 'Event added successfully',
        };

        dispatch('notification/add', notification, { root: true });
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a problem adding event: ' + error.message,
        };

        dispatch('notification/add', notification, { root: true });
        throw error;
      });
  },
  fetchEvents({ commit, dispatch }, { perPage, page }) {
    EventService.getEvents(perPage, page)
      .then(response => {
        commit('SET_TOTAL_EVENTS', response.headers['x-total-count']);
        commit('SET_EVENTS', response.data);
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching events: ' + error.message,
        };
        dispatch('notification/add', notification, { root: true });
      });
  },
  fetchEvent({ commit, getters, dispatch }, id) {
    var event = getters.getEventById(id);

    if (event) {
      commit('SET_EVENT', event);
    } else {
      EventService.getEvent(id)
        .then(response => {
          commit('SET_EVENT', response.data);
        })
        .catch(error => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching event: ' + error.message,
          };
          dispatch('notification/add', notification, { root: true });
        });
    }
  },
};

export const getters = {
  getEventById: state => id => {
    return state.events.find(event => event.id === id);
  },
};
