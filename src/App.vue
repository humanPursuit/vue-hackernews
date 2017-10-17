<template>
    <div id="wrapper">
        <!-- header -->
        <header class="header">
            <nav class="inner">
                <router-link to='/' exact>
                    <img src="https://news.ycombinator.com/y18.gif">
                </router-link>
                <router-link to="/top">Top</router-link>
                <router-link to="/new">New</router-link>
                <router-link to="/show">Show</router-link>
                <router-link to="/ask">Ask</router-link>
                <router-link to="/job">Jobs</router-link>
                <a href="https://github.com/vuejs/vue-hackernews-2.0" class="github" target="_blank" rel="noopener">Built with Vue.js</a>
            </nav>
        </header>
        <!-- main view -->
        <transition name='fade' mode='out-in'>
            <router-view class="view">
            </router-view>
        </transition>
    </div>
</template>

<style lang='less'>
@import './variables.less';

html,
body {
    height: 100%;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 15px;
    background-color: #f2f3f5;
    margin: 0;
    padding-top: 55px;
    overflow-y: scroll;
}

ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

a {
    color: #000;
    cursor: pointer;
    text-decoration: none;
}

.header {
    background-color: #f60;
    height: 55px;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;

    .inner {
        max-width: 800px;
        box-sizing: border-box;
        margin: 0 auto;
        padding: 15px 5px;
    }

    a {
        color: rgba(255, 255, 255, .8);
        line-height: 24px;
        transition: color .15s ease;
        display: inline-block;
        vertical-align: middle;
        font-weight: 300;
        letter-spacing: .075em;
        margin-right: 1.8em;
        &:hover {
            color: #fff;
        }
        &.router-link-active {
            color: #fff;
            font-weight: 400;
        }
        &:nth-child(6) {
            margin-right: 0;
        }
    }
    .github {
        color: #fff;
        font-size: .9em;
        margin: 0;
        float: right;
    }
}

.view {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
}

.fade-enter-active,
.fade-leave-active {
    transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}

@media screen and (max-width: 700px) {
    html,
    body {
        margin: 0;
    }
    #wrapper {
        width: 100%;
    }
}
</style>