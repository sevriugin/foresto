import { Meteor } from 'meteor/meteor';

import { Tasks }       from 'both/collections';
import { TASK_PUBLIC } from 'both/models';

Meteor.publish('tasks', function() {
  return Tasks.find(buildQuery.call(this), { fields: TASK_PUBLIC });
});
   
Meteor.publish('task', function(_id: string) {
  return Tasks.find(buildQuery.call(this, _id), { fields: TASK_PUBLIC });
});

function buildQuery(_id?: string): Object {
  const selector = {
    $or: [{ 
      public: true 
    }, { 
      $or: [{ 
        _createdBy: { $exists: true } //this.userId 
      }, {
        _createdBy: null
      }, {
        _createdBy: { $exists: false }
      }]
    }]
  };
    
  if (_id) {
    return {
      $and: [{
        _id: _id
        },
        selector
      ]
    };
  }

  return selector;
}