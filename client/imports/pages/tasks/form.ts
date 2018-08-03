import { Component, OnInit, OnDestroy }       from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
 
import { Tasks } from 'both/collections';

@Component({
  selector: 'tasks-form',
  templateUrl: './form.html'
})
export class TasksForm implements OnInit, OnDestroy {

  addForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder    
  ) {}
  
  ngOnInit() {
    this.addForm = this.formBuilder.group({
      text: ['The text', Validators.required],
      public: [false]      
    });
  }

  addTask(): void {
    if (!this.addForm.valid) {
      return;
    }

    //if (!Meteor.userId()) {
    //  alert('Please log in to add a task');
    //  return;
    //}
    
    //Tasks.insert(this.addForm.value); 
    Tasks.insert(Object.assign({}, this.addForm.value, { _createdBy: Meteor.userId() })); 

    this.addForm.reset({text: 'New'});
  }

  ngOnDestroy() {}   

}