/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
import observer from 'utils/observer';

import test from 'components/test.vue';

export default function() {

    new Vue({
        el: '#app',
        render: h => h(test)
    })

    console.log(observer);
    console.log(new Vue());
};
