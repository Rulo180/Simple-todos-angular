import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import { Tasks } from '../../api/tasks.js'

class TodoListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.helpers({
            tasks() {
                return Tasks.find({}, {
                    sort: {
                        createdAt: -1
                    }
                });
            }
        })
    }

    addTask(newTask) {
        // Insert a task into the collection
        Tasks.insert({
            text: newTask,
            createdAt: new Date()
        });

        // clear form
        this.newTask= '';
    }

    setChecked(task) {
        // Set the checked propery tot he opposite of its current value
        Tasks.update(task._id, {
            $set: {
                checked: !task.checked
            },
        });
    }
    
    removeTask(task) {
        // Remove a task from the collection
        Tasks.remove(task._id);
    }

}

export default angular.module('todosList', [
    angularMeteor
])
    .component('todosList', {
        templateUrl: 'imports/components/todosList/todosList.html',
        controller: ['$scope', TodoListCtrl]
    });