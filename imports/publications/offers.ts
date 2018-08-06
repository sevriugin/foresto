import { DatePipe }                      from '@angular/common'
import { UserRole, Offer, OFFER_PUBLIC } from 'both/models';
import { Users, Offers }                 from 'both/collections';

Meteor.publish('offers', (): Mongo.Cursor <Offer> => {
   
  const user = Users.collection.findOne({ _id: Meteor.userId() });
  const role = user && user.profile && user.profile.role;
  if (role == UserRole.PARTNER) {
  
    return Offers.collection.find(
      { _createdBy: user._id }, 
      { fields: OFFER_PUBLIC }
    );
  }
  else if (role == UserRole.CLIENT) {
  
    const datePipe = new DatePipe("en-US");
    const moment = new Date();
    const momentStr = datePipe.transform(moment, 'yyyy-MM-dd');

    return Offers.collection.find({ 
      validFrom: { $lte: momentStr },
      expired:   { $gte: momentStr } 
    }, { fields: OFFER_PUBLIC });
  }
  else {
    return;
  };



});
