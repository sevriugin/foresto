import { Meteor }                       from 'meteor/meteor';
import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { Task }  from 'both/models';
import { Tasks } from 'both/collections';

@Component({
  templateUrl: './tasks.html'
})
export class TasksPage implements OnInit, OnDestroy {

  tasksSub: Subscription;
  tasks: Observable <Task[]>;

  constructor() {}

  ngOnInit() {
    this.tasksSub = MeteorObservable.subscribe('tasks').subscribe(() => {
      
      this.tasks = Tasks.find({});
    });
  }

  add(task: Task): void {
    if (!Meteor.userId()) {
      alert('Please log in to add a task');
      return;
    }

    Tasks.insert(task);
  }  

  remove(task: Task): void {
    if (!Meteor.userId()) {
      alert('Please log in to remove a task');
      return;
    }
    
    Tasks.remove(task._id);
  }  
  
  search(value: string): void {
    this.tasks = Tasks.find(value ? { text: value } : {});
  }
 
  ngOnDestroy() {
    this.tasksSub.unsubscribe();
  }  

}