# NestJS Firestore

<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
  </a>
</p>

This project helps you to use your Firestore collections in a well known way,
similar\* to how TypeORM lets you to handle your tables.

The principal benefits are:

- Model your collections using classes (similar on how ORMs works).
- Simplify the testing of the Firestore SDK.

_\*This is NOT an ORM._

## Installation

In order to install this package simply run the following command.

```bash
npm install @cristobalgvera/nestjs-firestore
```

## Usage

The simplest way to use it is the following:

1. Import the `FirestoreModule#forRoot` into your main module.

   ```ts
   import { FirestoreModule } from '@cristobalgvera/nestjs-firestore';
   import { Module } from '@nestjs/common';

   @Module({
     imports: [
       FirestoreModule.forRootAsync({
         useFactory: (environmentService: EnvironmentService) => ({
           // You can define custom properties here, see https://github.com/googleapis/nodejs-firestore
           projectId: 'firebase-project-id',
         }),
       }),
     ],
   })
   export class AppModule {}
   ```

1. Define your model (currently only classes are supported).

   ```ts
   export class User {
     name: string;
     age: number;
   }
   ```

1. Import the `FirestoreModule#forFeature` into your feature module.

   ```ts
   import { FirestoreModule } from '@cristobalgvera/nestjs-firestore';
   import { Module } from '@nestjs/common';
   import { User } from './user.collection';

   @Module({
     imports: [
       FirestoreModule.forFeature([
         { collection: User, path: 'path-to-your-collection' },
       ]),
     ],
   })
   export class UserModule {}
   ```

1. Inject the collection into your services using the `InjectCollection` decorator
   and the `FirestoreCollection` type. The `FirestoreCollection` needs a generic
   class (soon type or interface too) in order to type your collection.

   The `FirestoreCollection` is a wrapper on top of the `CollectionReference` type
   provided by `@google-cloud/firestore`, so you can use the entire API, but it
   will provide correct typing based in the collection class.

   ```ts
   import {
     FirestoreCollection,
     InjectCollection,
   } from '@cristobalgvera/nestjs-firestore';
   import { Injectable } from '@nestjs/common';
   import { User } from './user.collection';

   @Injectable()
   export class UserService {
     constructor(
       @InjectCollection(User)
       private readonly userCollection: FirestoreCollection<User>,
     ) {}

     saveUser({ name, age }: SaveUserDto) {
       return this.userCollection.add({ name, age });
     }
   }
   ```

1. Test it using the `getCollectionToken` to get the token used to inject the collection
   in the service.

   ```ts
   import { TestBed } from '@automock/jest';
   import {
     FirestoreCollection,
     getCollectionToken,
   } from '@cristobalgvera/nestjs-firestore';
   import { User } from './user.collection';
   import { UserService } from './user.service';

   describe('UserService', () => {
     let underTest: UserService;
     let userCollection: FirestoreCollection<User>;

     beforeEach(() => {
       // Don't focus on how to create the context of the test
       const { unit, unitRef } = TestBed.create(UserService).compile();
       underTest = unit;

       userCollection = unitRef.get(getCollectionToken(User)); // <-- THIS IS THE IMPORTANT PART
     });

     /* Your tests here... */
   });
   ```
