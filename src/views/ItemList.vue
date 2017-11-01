<template>
    <div class="news-view">
        <div class="news-list-nav">
            <router-link v-if="page > 1" :to="'/' + type + '/' + (page - 1)">&lt; prev</router-link>
            <a v-else class="disabled">&lt; prev</a>
            <span>{{page}} / {{maxPage}}</span>
            <router-link v-if="hasMore" :to="'/' + type + '/' + (page + 1)">more &gt;</router-link>
            <a v-else class="disabled">more &gt;</a>
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
import Item from "../components/Item.vue";
import * as API from "../api";

const storiesPageSize = 30;

export default {
  name: "item-list",
  components: {
    Item
  },
  props: {
    type: String
  },
  data() {
    return {
      transition: "slide-right",
      displayedItems: this.$store.getters.activeItems,
      displayedPage: Number(this.$route.params.page) || 1
    };
  },
  computed: {
    page() {
      return Number(this.$route.params.page) || 1;
    },
    maxPage() {
      const { itemPerPage, lists } = this.$store.state;
      return Math.ceil(lists[this.type] / itemPerPage);
    },
    hasMore() {
      return this.page < this.maxPage;
    }
  },

  beforeMount() {
    if (this.$root._isMounted) {
      this.loadItems(this.page);
    }

    this.unwatchList = API.watchList(this.type, ids => {
      // update store list and type
      this.$store.commit("SET_LIST", { type: this.type, ids });
      // fetch items
      this.$store.dispach("ENSURE_ACTIVE_ITEMS").then(() => {
        this.displayedItems = this.$store.getters.activeItems;
      });
    });
  },

  watch: {
    page(to, from) {
      this.loadItems(to, from);
    }
  },

  beforeDestroy() {
    this.unwatchList();
  },

  methods: {
    loadItems(to = this.page, from = -1) {
      this.$bar.start();

      this.$store
        .dispatch("FETCH_LIST_DATA", {
          type: this.type
        })
        .then(() => {
          if (this.page < 0 || this.page > this.maxPage) {
            this.$router.replace(`/${this.type}/1`);
            return;
          }
          this.transition =
            from === -1 ? null : to > from ? "slide-left" : "slide-right";
          this.displayedItems = this.$store.getters.activeItems;
          this.$bar.finish();
        });
    }
  }
};
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
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
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
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
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

