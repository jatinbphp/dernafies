import { Injectable } from '@angular/core';
import { AngularFirestore,  AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})

export class FirebaseClientService 
{

  constructor(private db: AngularFirestore)
  { }

  addMessageEntryToFirebase(data)
  {
    return this.db.collection('jobs').add(data);
  }

  getBookingCommunication(docID)
  {
    return this.db.collection('jobs').doc(docID).collection("job_messages", ref => ref.orderBy("message_added_date","desc")).valueChanges();
  }

  sendBookingMessage(docID, data) 
	{		
		return this.db.collection('jobs').doc(docID).collection("job_messages").add(data);
  }
}
