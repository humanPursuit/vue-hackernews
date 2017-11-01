<template>
    <div class="item-view" v-if="item">
        <template v-if="item">
            <div class="item-view-header">
                <a :href="item.url" target="_blank">
                    <h1>{{ item.title }}</h1>
                </a>
                <span v-if="item.url" class="host">{{ item.url | host }}</span>
                <p class="meta">
                    {{item.score}} points | by
                    <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
                    {{ item.time | timeAgo }} ago
                </p>
            </div>
            <div class="item-view-comments">
                <p class="item-view-comments-header">
                    {{ item.kids ? item.descendants + ' comments' : 'No comments yet.' }}
                </p>
                <spinner :show="loading"></spinner>
                <ul v-if="!loading" class="comment-children">
                    <comment v-for="id in item.kids" :key="id" :id="id"></comment>
                </ul>
            </div>
        </template>
    </div>
</template>

<script>
import Spinner from "../components/Spinner.vue";
import Comment from "../components/Comment.vue";

const fetchComments = (store, item, updateFn) => {
  if (item && item.kids) {
    return store
      .dispatch("FETCH_ITEMS", {
        ids: item.kids
      })
      .then(() => Promise.all(item.kids.map(id => fetchComments(store, store.state.items[id]))));
  }
};

export default {
  name: "ItemView",

  components: {
    Spinner,
    Comment
  },

  asyncData({ store, route: { params: { id } } }) {
    return store.dispatch("FETCH_ITEMS", { ids: [id] });
  },

  data() {
    return {
      items: {}, // local store
      loading: false
    };
  },

  beforeMount() {
    this.fetchComments();
  },

  computed: {
    item() {
      return this.$store.state.items[this.$route.params.id];
    }
  },

  watch: {
    item: "fetchComments"
  },

  methods: {
    fetchComments() {
      if (!this.item || !this.item.kids) return;

      this.loading = true;

      fetchComments(this.$store, this.item).then(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="less">
.item-view-header {
  background-color: #fff;
  padding: 1.8em 2em 1em;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  h1 {
    display: inline;
    font-size: 1.5em;
    margin: 0;
    margin-right: 1.5em;
  }
  .host,
  .meta,
  .meta a {
    color: #828282;
  }
  .meta a {
    text-decoration: underline;
  }
}

.item-view-comments {
  background: #fff;
  margin-top: 10px;
  padding: 0 2em 0.5em;
}

.item-view-comments-header {
  margin: 0;
  font-size: 1.1em;
  padding: 1em 0;
  position: relative;
  .spinner {
    display: inline-block;
    margin: -15px 0;
  }
}

.comment-children {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
