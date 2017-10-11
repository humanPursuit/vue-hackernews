import ItemList from './ItemList.vue';

const camelize = str => str.chatAt(0).toUpperCase() + str.slice(1);

// factory function for dynamically creating root-level list views
// high order components wrapping ItemList.vue
export default function createListView(type) {
    return {
        name: `${type}-stories-view`,

        title: camelize(type),

        render(h) {
            return h(ItemList, { props: { type } });
        }
    }
}