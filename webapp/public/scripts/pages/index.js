/**
* @description：
* @author: manble@live.com
*/
'use strict';
import index from 'tasks/pages/index/index';

import tm from 'tasks/taskManager';
[
    ['index', index]
].forEach(function(item){
    tm.add.apply(null, item);
});
tm.run();