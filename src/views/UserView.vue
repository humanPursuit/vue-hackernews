<template>
    <div class="user-view" v-show="user">
        <template v-if="user">
            <h1>User: {{ user.id }}</h1>
            <ul class="meta">
                <li>
                    <span class="label">Created:</span> {{user.created | timeAgo}} ago</span>
                </li>
                <li>
                    <span class="label">Karma:</span> {{user.karma}}</span>
                </li>
                <li v-if="user.about" v-html="user.about" class="about"></li>
            </ul>
            <p class="links">
                <a :href="'https://news.ycombinator.com/submitted?id=' + user.id">submissions</a><br>
                <a :href="'https://news.ycombinator.com/threads?id=' + user.id">comments</a>
            </p>
        </template>
        <template v-else-if="user === false">
            <h1>User not found.</h1>
        </template>
    </div>
</template>

<script>
export default {
  name: "UserView",

  asyncData({ store, route: { params: { id } } }) {
    return store.dispatch("FETCH_USER", { id });
  },

  beforeMount() {
    const id = this.params.id;
    API.fetchUser(id).then(user => {
      this.user = user;
    });
  },

  computed: {
    user() {
      return this.$store.state.users[this.$route.params.id];
    }
  },

  title() {
    return this.user ? this.user.id : "User not found";
  }
};
</script>

<style lang="less">
.user-view {
  background-color: #fff;
  box-sizing: border-box;
  padding: 2em 3em;
  h1 {
    margin: 0;
    font-size: 1.5em;
  }
  .meta {
    list-style-type: none;
  }
  .label {
    display: inline-block;
    min-width: 4em;
  }
  .about {
    margin: 1em 0;
  }
  .links a {
    text-decoration: underline;
  }
}
</style>