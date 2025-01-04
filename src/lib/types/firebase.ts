import type { Auth, GoogleAuthProvider } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';

export interface FirebaseInstances {
  auth: Auth;
  db: Firestore;
  app: FirebaseApp;
  googleProvider: GoogleAuthProvider;
}
