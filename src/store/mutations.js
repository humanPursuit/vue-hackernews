import Vue from 'vue';

export default {
    // { [type: string]: Function}
    // args: state, [payload]
    SET_ACTIVE_TYPE: (state, { type }) => {
        state.activeType = type;
    },

    SET_LIST: (state, { type, ids }) => {
        state.list[type] = ids;
    },

    SET_ITEMS: (state, { items }) => {
        items.forEach(item => {
            if (item) {
                Vue.set(state.items, item.id, item);
            }
        });
    },

    SET_USER: (state, { id, user }) => {
        Vue.set(state.users, id, user || false) // false means user not found
    },
}