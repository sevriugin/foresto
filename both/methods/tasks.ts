import { Tasks }  from '../collections';
import { Email }  from 'meteor/email';
import { check }  from 'meteor/check';
import { Meteor } from 'meteor/meteor';
 
function getContactEmail(user:Meteor.User):string {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
 
  return null;
}
 
Meteor.methods({
  invite: function (taskId:string, userId:string) {
    check(taskId, String);
    check(userId, String);
 
    let task = Tasks.collection.findOne(taskId);
 
    if (!task)
      throw new Meteor.Error('404', 'No such task!');
 
    if (task.public)
      throw new Meteor.Error('400', 'That task is public...');
 
    if (task._createdBy && task._createdBy !== this.userId)
      throw new Meteor.Error('403', 'No permissions!');
 
    if (task._createdBy !== userId /*&& (task.invited || []).indexOf(userId) == -1*/) {
      Tasks.collection.update(taskId, { $addToSet: { invited: userId } });
 
      let from = getContactEmail(Meteor.users.findOne(this.userId));
      let to = getContactEmail(Meteor.users.findOne(userId));
 
      if (Meteor.isServer && to) {
        Email.send({
          from: 'noreply@socially.com',
          to: to,
          replyTo: from || undefined,
          subject: 'TASK: ' + task.text,
          text: `Hi, I just invited you to ${task.text} on Socially.
                        \n\nCome check it out: ${Meteor.absoluteUrl()}\n`
        });
      }
    }
  }
});