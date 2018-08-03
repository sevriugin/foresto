import { MongoObservable } from 'meteor-rxjs';

import { Task } from '../models';
 
export const Tasks = new MongoObservable.Collection <Task> ('tasks');

//function loggedIn() {
//  return !!Meteor.user();
//}

//Tasks.allow({
//  insert: loggedIn,
//  update: loggedIn,
//  remove: loggedIn
//});

Tasks.allow({
  insert(userId, task) { 
    return true; //userId && !!task._createdBy && task._createdBy === userId;
  } ,
  update(userId, task, fields, modifier) {
    return true; //userId && !!task._createdBy && task._createdBy === userId;
  },
  remove(userId, task) {
    //return userId && !!task._createdBy && task._createdBy === userId;
    return true; //! task._createdBy || (userId && task._createdBy === userId);
  }
});