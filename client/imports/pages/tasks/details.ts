import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute }               from '@angular/router';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';
import { InjectUser }                   from 'angular2-meteor-accounts-ui'; 
 
import 'rxjs/add/operator/map';

import { Tasks }      from 'both/collections';
import { Task, User } from 'both/models';

@Component({
  templateUrl: './details.html'
})
@InjectUser('user')
export class TaskDetails implements OnInit , OnDestroy {

  user: User;

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
          MeteorObservable.autorun().subscribe(() => {
            this.task = Tasks.findOne(this.taskId);
          });
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

  invite(user: User) {
    if (!user) {
      alert('No current user!');
      return;
    }
    MeteorObservable.call('invite', this.task._id, user._id).subscribe(() => {
      alert('User successfully invited.');
    }, (error) => {
      alert(`Failed to invite due to ${error}`);
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.taskSub.unsubscribe();
    this.tasksSub.unsubscribe();
  }  

}