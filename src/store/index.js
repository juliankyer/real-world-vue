import Vue from 'vue';
import Vuex from 'vuex';
import EventService from '@/services/EventService.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: { id: 'abc123', name: 'Gary Numan' },
    categories: [
      'sustainability',
      'nature',
      'animal welfare',
      'housing',
      'education',
      'food',
      'community',
    ],
    events: [],
    event: {},
    totalEvents: 0,
  },
  mutations: {
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
  },
  actions: {
    createEvent({ commit }, event) {
      return EventService.postEvent(event).then(() =>
        commit('ADD_EVENT', event),
      );
    },
    fetchEvents({ commit }, { perPage, page }) {
      EventService.getEvents(perPage, page)
        .then(response => {
          commit('SET_TOTAL_EVENTS', response.headers['x-total-count']);
          commit('SET_EVENTS', response.data);
        })
        .catch(error => {
          console.log('Error:', error.response);
        });
    },
    fetchEvent({ commit, getters }, id) {
      var event = getters.getEventById(id);

      if (event) {
        commit('SET_EVENT', event);
      } else {
        EventService.getEvent(id)
          .then(response => {
            commit('SET_EVENT', response.data);
          })
          .catch(error => {
            console.log('Error:', error.response);
          });
      }
    },
  },
  modules: {},
  getters: {
    getEventById: state => id => {
      return state.events.find(event => event.id === id);
    },
  },
});
