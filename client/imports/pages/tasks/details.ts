import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute }               from '@angular/router';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';
 
import 'rxjs/add/operator/map';

import { Tasks } from 'both/collections';
import { Task }  from 'both/models';

@Component({
  templateUrl: './details.html'
})
export class TaskDetails implements OnInit , OnDestroy {

  paramsSub: Subscription;

  taskId: string;
  task: Task;
  tasks: Observable <Task[]>;
  taskSub: Subscription;
  tasksSub: Subscription;
  
  constructor(
    private route: ActivatedRoute
  ) {}
 
  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['taskId'])
      .subscribe(taskId => {
        this.taskId = taskId;

        this.taskSub = MeteorObservable.subscribe('task', this.taskId).subscribe(() => {
          this.task = Tasks.findOne(this.taskId);
        });

        this.tasksSub = MeteorObservable.subscribe('tasks').subscribe(() => {
          this.tasks = Tasks.find( { _id: this.taskId } );
        });
      });
  }

  save() {
    //if (!Meteor.userId()) {
    //  alert('Please log in to update a task');
    //  return;
    //}

    Tasks.update(this.task._id, {
      $set: {
        text: this.task.text,
        public: this.task.public,
      }
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.taskSub.unsubscribe();
    this.tasksSub.unsubscribe();
  }  

}