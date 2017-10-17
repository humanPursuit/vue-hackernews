<template>
    <div class="news-view">
        <div class="news-list-nav">
            <router-link v-if="page > 1" :to="'/' + type + '/' + (page - 1)">&lt; prev</router-link>
            <span>{{page}} / {{maxPage}}</span>
            <router-link v-if="hasMore" :to="'/' + type + '/' + (page + 1)">more &gt;</router-link>
        </div>
        <transition :name="transition">
            <div class="news-list" :key="displayedPage" v-if="displayedPage > 0">
                <transition-group tag="ul" name="item">
                    <item v-for="item in displayedItems" :key="item.id" :item="item">
                    </item>
                </transition-group>
            </div>
        </transition>
    </div>
</template>

<script>
import Item from '../components/Item.vue';
import store from '../store';
import { watchList } from '../api';

export default {
    name: 'item-list',
    components: {
        Item,
    },
    props: {
        type: String,
    },
    data() {
        return {
            transition: 'slide-right',
            displayedPage: Number(this.$route.params.page) || 1,
            displayedItems: [],
        }
    },
    computed: {
        page() {
            return Number(this.$route.params.page) || 1;
        },
        maxPage: {
            get() {
                const { storiesPageSize, list } = store;
                return Math.ceil(list[this.type].length / storiesPageSize);
            },
            set(ids) {
                const { storiesPageSize } = store;
                return ids.length / storiesPageSize;
            },
        },
        hasMore() {
            return this.page < this.maxPage;
        }
    },
    beforeMount() {
        if (this.$root._isMounted) {
            this.loadItems(this.page);
        }

        this.unwatchList = watchList(this.type, (ids) => {
            // update store list and type
            store.list[this.type] = ids || [];
            store.type = this.type;
            // fetch items
            this.fetchPageItems();
        });
    },
    watch: {
        page(to, from) {
            this.loadItems(to, from);
        }
    },
    methods: {
        loadItems(to = this.page, from = -1) {
            this.$bar.start();

            store.fetchStoriesIds(this.type)
                .then(() => {
                    if (this.page < 0 || this.page > this.maxPage) {
                        this.$router.replace(`/${this.type}/1`)
                        return
                    }
                    this.transition = from === -1
                        ? null
                        : to > from ? 'slide-left' : 'slide-right'
                    this.displayedPage = to;
                    this.fetchPageItems();
                    this.$bar.finish();
                })
        },
        fetchPageItems(page = this.page) {
            store.fetchItemsByPage(this.page)
                .then(items => {
                    this.displayedItems = items;
                });
        }
    }
}
</script>

<style lang="less">
.news-view {
    padding-top: 45px;
}

.news-list-nav,
.news-list {
    background-color: #fff;
    border-radius: 2px;
}

.news-list-nav {
    padding: 15px 30px;
    position: fixed;
    text-align: center;
    top: 55px;
    left: 0;
    right: 0;
    z-index: 998;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
    a {
        margin: 0 1em;
    }
    .disabled {
        color: #ccc;
    }
}

.news-list {
    max-width: 800px;
    margin: 30px auto;
    position: relative;
    transition: all .5s cubic-bezier(.55,0,.1,1);
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
}

.slide-left-enter,
.slide-right-leave-to {
    opacity: 0;
    transform: translate(30px, 0);
}

.slide-left-leave-to,
.slide-right-enter {
    opacity: 0;
    transform: translate(-30px, 0);
}

.item-move,
.item-enter-active,
.item-leave-active {
    transition: all .5s cubic-bezier(.55, 0, .1, 1)
}

.item-enter {
    opacity: 0;
    transform: translate(30px, 0);
}

.item-leave-active {
    position: absolute;
    opacity: 0;
    transform: translate(30px, 0);
}
</style>

