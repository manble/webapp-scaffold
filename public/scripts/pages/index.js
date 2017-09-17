/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

// vue test
import test from 'components/test.vue';
import Vue from 'vue';

new Vue({
    el: '#app',
    render: h => h(test)
});

// react test
// import React from 'react';
// import ReactDOM from 'react-dom';
// ReactDOM.render(
//     <h1>Hello, world!</h1>,
//     document.querySelector('#app')
// );