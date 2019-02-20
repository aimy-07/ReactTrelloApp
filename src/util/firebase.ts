/* tslint:disable:object-literal-sort-keys ordered-imports*/
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const fbConfig = {
    apiKey: 'AIzaSyCvQdcANbPf5EO_S5pS78t0hc9IOlIfSMQ',
    authDomain: 'trelloapp-2a481.firebaseapp.com',
    databaseURL: 'https://trelloapp-2a481.firebaseio.com',
    messagingSenderId: '462124863905',
    projectId: 'trelloapp-2a481',
    storageBucket: 'trelloapp-2a481.appspot.com',
};

export const firebaseApp = firebase.initializeApp(fbConfig);
export const firebaseDb = firebaseApp.database();
export const firebaseAuth = firebaseApp.auth();
