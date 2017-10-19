<template>
    <li v-if="comment" class="comment">
        <div class="by">
            <router-link :to="'/user/' + comment.by">{{comment.by}}</router-link>
            {{ comment.time | timeAgo }} ago
        </div>
        <div class="text" v-html="comment.text"></div>
        <div class="toggle" :class="{open}" v-if="comment.kids && comment.kids.length">
            <a @click="open = !open">
                {{ open ? '[-]' : '[+]' + pluralize(comment.kids.length) + 'collapsed' }}
            </a>
        </div>
        <ul class="comment-children" v-show="open">
            <comment v-for="id in comment.kids" :key="id" :id="id"></comment>
        </ul>
    </li>
</template>

<script>
import * as API from '../api';

export default {
    name: 'Comment',

    props: {
        id: Number,
    },

    data() {
        return {
            open: true,
            comment: {},
        };
    },

    methods: {
        pluralize: n => n + (n === 1 ? 'reply' : 'replies')
    },

    beforeMount() {
        API.fetchItem(this.id).then(comment => {
            this.comment = comment;
        });
    }
}
</script>

<style lang="less">
.comment-children {
    .comment-children {
        margin-left: 1.5em;
    }
}

.comment {
    @text-color: #828282;
    border-top: 1px solid #eee;
    position: relative;
    .by,
    .text,
    .toggle {
        font-size: .9em;
        margin: 1em 0;
    }
    .by {
        color: @text-color;
        a {
            color: @text-color;
            text-decoration: underline;
        }
    }
    .text {
        overflow-wrap: break-word;
        a:hover {
            color: #ff6600;
        }
        pre {
            white-space: pre-wrap;
        }
    }
    .toggle {
        background-color: #fffbf2;
        padding: .3em .5em;
        border-radius: 4px;
        a {
            color: @text-color;
        }
        &.open {
            padding: 0;
            background-color: transparent;
            margin-bottom: .5em;
        }
    }
}
</style>