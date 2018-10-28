/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

// vue test
// import test from 'components/test.vue';
// import Vue from 'vue';
// new Vue({
//     el: '#app',
//     render: h => h(test)
// });

// react test
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

class Test extends Component {
    render() {
        return <div>
            <h1>Hello, world!</h1>
        </div>
    }
}

render(
    <Test />,
    document.querySelector('#app')
);

import request from 'models/example';

request.example().then(res => {
    console.log('res', res);
});