<template>
    <li class="news-item">
        <span class="score">{{ item.score }}</span>
        <span class="title">
            <template v-if="item.url">
                <a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a>
                <span class="host">({{ item.url | host }})</span>
            </template>
            <template v-else>
                <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
            </template>
        </span>

        <span class="meta">
            <span v-if="item.type !== 'job'" class="by">
                by
                <router-link :to="'/user' + item.by">{{ item.by }}</router-link>
            </span>
            <span class="time">{{ item.time | timeAgo }} ago</span>
            <span v-if="item.type !== 'job'" class="comments-link">
                |
                <router-link :to="'/item/' + item.id">{{ item.descendants }} comments</router-link>
            </span>
            <span class="label" v-if="item.type !== 'story'">{{ item.type }}</span>
        </span>
    </li>
</template>

<script>
export default {
    name: 'news-item',

    props: {
        item: Object,
    },

    computed: {
        href() {
            return this.item.url || ('#/item/' + this.item.id)
        },
        showInfo() {
            return this.item.type === 'story' || this.item.type === 'pool'
        },
        showDomain() {
            return this.item.type === 'story'
        }
    }
}
</script>

<style lang='less'>
@import '../variables.less';
.item {
    padding: 2px 0 2px 40px;
    position: relative;

    transition: background-color .2s ease;
    p {
        margin: 2px 0;
    }
    .title:visited {
        color: @gray;
    }
    .index {
        color: @gray;
        position: absoulte;
        width: 30px;
        text-align: right;
        left: 0;
        top: 4px;
    }
    .domain,
    .subtext {
        font: 14px;
        color: @gray;
        a {
            color: @gray;
            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>

