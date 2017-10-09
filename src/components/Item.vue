<template>
    <div class="item">
        <span class="index">{{index}}.</span>
        <p>
            <a :href="href" target="_blank" class="title">{{item.title}}</a>
            <span class="domain" v-show="showDomain">
                {{item.url|domain}}
            </span>
        </p>
        <p class="subtext">
            <span v-show="showInfo">
                {{item.score}} points by
                <a :href="'#/user/' + item.by">{{item.by}}</a>
            </span>
            {{item.time| fromNow}} ago
            <span class="comments-link" v-show="showInfo">
                |
                <a :href="'#/item/' + item.id">{{item.descendants}} </a>
            </span>
        </p>
    </div>
</template>

<script>
export default {
    name: 'Item',

    props: {
        item: Object,
        index: Number,
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

