import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import { Tasks } from '../../api/tasks.js'
import { Meteor } from 'meteor/meteor';

class TodoListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.hideCompleted = false;

        this.subscribe('tasks');        //Suscripcion a la coleccion de Tasks

        this.helpers({
            tasks() {
                const selector = {};
 
                // If hide completed is checked, filter tasks
                if (this.getReactively('hideCompleted')) {
                selector.checked = {
                    $ne: true
                };
                }

                // Show newest tasks at the top
                return Tasks.find(selector, {
                sort: {
                    createdAt: -1
                }
             });
            },
            incompleteCount() {
            return Tasks.find({
            checked: {
                $ne: true
            }
            }).count();
        },
        currentUser() {
            return Meteor.user();
        }
        })
    }

    addTask(newTask) {
        // Insert a task into the collection
        Meteor.call('tasks.insert', newTask);

        // clear form
        this.newTask= '';
    }

    setChecked(task) {
        // Set the checked propery tot he opposite of its current value
        Meteor.call('tasks.setChecked', task._id, !task.checked);
    }
    
    removeTask(task) {
        // Remove a task from the collection
        Meteor.call('tasks.remove', task._id);
    }

    setPrivate(task) {
        Meteor.call('tasks.setPrivate', task._id, !task.private);
    }
}

export default angular.module('todosList', [
    angularMeteor
])
    .component('todosList', {
        templateUrl: 'imports/components/todosList/todosList.html',
        controller: ['$scope', TodoListCtrl]
    });