# Poetry Gallery

This is a vast repository of Bengali Poems based on Node JS, Express 6 and MongoDB

Live at : [https://boiling-crag-42301.herokuapp.com/](https://boiling-crag-42301.herokuapp.com/)

**Migrated CodeBase to ES6**

### Features
- Fully Materialistic
- User authentication 
- Add new poems (Admin only)
- Edit and delete poems (Admin only)
- Users can add comments to posts only when logged in
- Users can like and dislike posts
- Users can edit and delete comments
- Added authorization to keep add, edit and delete poems as Admin only features.
- Added authorization to comments and comment owners can only edit or delete comments.
- Comments are time-stamped by user's name 
- Comments are dynamically time-stamped as days, hours or minutes

**UPCOMING FEATURES**
- Add ability for users to upload profile picture.


### Installing

Run the following command in the terminal to setup the dev environment

```
npm install express, mongoose, body-parser, method-override, express-session, passport, passport-local, passport-local-mongoose, moment, ejs --save
```