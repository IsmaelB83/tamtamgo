// Node imports
const moment = require('moment');
// Own imports
const { TaskList, Task, User } = require('../models');

const ctrl = {};

ctrl.all = async (req, res, next) => {
    try {
        // Query information to mongodb
        let tasks, taskLists = await TaskList.find({}).sort({_id: 1});
        if (!taskLists || taskLists.length === 0) {
            res.status(404).json({
                status: 'error', 
                description: 'Number of taskList lists found is 0',
                result: {}
            });
            return;
        }
        // Conformo los arrays de las listas de sistema
        for (let i = 1; i <= 3; i++) {
            const list = taskLists[i];
            switch (list.systemId) {
                case 1:
                    // Starred
                    tasks = await Task.find({starred: true});
                    break;           
                case 2:
                    // Due today
                    const today = moment().startOf('day')
                    tasks = await Task.find({due: { $lte: moment(today).endOf('day').toDate() }});
                    break;
                case 3:
                    // Due week
                    const weekStart = moment().startOf('week'), weekEnd = moment().endOf('week');
                    tasks = await Task.find({
                        due: {   
                            $gte: weekStart.toDate(),
                            $lte: weekEnd.toDate() 
                        }
                    });
                    break;
            }
            list._id = taskLists[0]._id;
            tasks.forEach(t => { 
                list.tasks.push(t._id)
                if (t.starred) list.starred.push(t._id);
            });
        }
        // Return information
        res.json({
            status: 'ok',
            description: `Total of taskList lists: ${taskLists.length}`,
            result: taskLists
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            description: `Uncontrolled error: ${error}`,
            result: {}
        });
    }
}

ctrl.create = async (req, res, next) => {
    try {
        let taskList = new TaskList({...req.body});
        taskList.active = true;
        let user = await User.findOne({email: 'ismaelbernal83@gmail.com'});
        if (user) {
            taskList.members.push(user);
        }
        user = await User.findOne({email: 'tamazzu@hotmail.com'});
        if (user) {
            taskList.members.push(user);
        }
        await taskList.save();
        res.json({status: 'ok', result: taskList});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

ctrl.getById = async (req, res, next) => {
    try {
        let taskList = await TaskList.findOne({_id: req.params.id});
        if (!taskList) {
            res.status(404).json({
                status: 'error', 
                description: 'Number of taskList lists found is 0',
                result: {}
            });
            return ;
        }
        res.json({
            status: 'ok',
            description: `taskList list found`,
            result: taskList
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

ctrl.updateById = async (req, res, next) => {
    try {
        let taskList = await TaskList.findOne({_id: req.params.id});
        if (!taskList) {
            res.status(404).json({
                status: 'error',
                description: `taskList not found`,
                result: {}
            }); 
            return;
        }
        taskList.description = req.body.description;
        taskList.active = req.body.active;
        taskList = await taskList.save();
        if (!taskList) {
            res.json({
                status: 'error',
                description: `Error updating the task`,
                result: {}
            }); 
            return;
        }
        res.json({status: 'ok', result: taskList});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

module.exports = ctrl;