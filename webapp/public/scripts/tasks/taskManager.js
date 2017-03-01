/**
* @description：
* @author: manble@live.com
*/
'use strict';
var taskList = [],
    taskAnalyze = window.taskAnalyze = {};

var TaskManager = {

    add: function(taskName, func, context, args) {
        taskList.push({
            name: taskName || '',
            run: function() {
                typeof func == 'function' && func.apply(context || null, args || []);
            }
        });
    },

    run: function() {
        var task = taskList.shift(),
            startTime = new Date(),
            error = null;

        taskList.length && setTimeout(()=>{
            this.run();
        }, 0);

        try {
            task.run();
        } catch (e) {
            typeof(console || {}).error == 'function' && console.error('error in task ', task.name, ':', e, e.stack);
            error = e;
        }

        taskAnalyze[task.name] = {
            duration: new Date() - startTime,
            status: error === null ? 'success' : error.name + ':' + error.message + '|@|' + error.stack
        };

    }
};

export default TaskManager;