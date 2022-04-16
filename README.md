# ECommerce-App
***
## Description 
***
Simple monolothic web application provides thorough eCommerce shopping process for customer. Features provided contains:
* Simple Menu Page
* Built-in cart with add or remove items actions
* Review Cart Page
* Register, login account with email (verification not supported yet)
* Integrated PayPal API (sandbox only) for creating and capturing orders from between Customer account and Business Account
* Chat system between online logged-in customers.

## Technical Choice
***
### Authentication and Authorization
* Authentication
Simple password and username registeration and login.
Session-based authentication is used to recognized for logged in user, have not handled memory leaks.
* Authorization
Currently using simple role-based access control

| Roles | Requirement | Permission   | 
| ----- | ----------- | ------------ |
| Guest | Nothing     |View Menu, Cart Modification     |
|Member |Registered Account, Login Successfully| All Guest Permission + Create and capture orde, Chatting to other logged in members|

### Security
* Password is hashed with salt before storing to databse
* HTTPS with Certificate connection is currently developed

### Database Management System
**Database**: MongoDB
**Connecting Modules**: Mongoose
**Current Collection**: User, Category, Funiture, Order, ChatBox

### Frontend Development
**Framework of choice**: React, using function component with hooks useState, useEffect, useSomething,...
**Global state management tools**: Redux
**Cookie library**: react-cookie
**Language of choice**: Javascript
**Styling language** Pure CSS, not using framework yet
**Library and modules**: 
* redux-toolkit: Redux-recommened library module, support easy-to-comprehend abstracted way to write asynchronous middleware, and mutable state command
* react-cookie: React prominent library for handle cookies
* react-router-dom v6: Desktop Router cho React Pages
* socket.io-client: client library for socketIO, handle abstracted WebSocket connection
* react-paypal-js: PayPal-provided PayPal button component that able to emerge PayPal Default Popup Payment Page when clicked. Able to call 2 function: 
..* createOrder: to handle access server APIs for createOrder Process
..* onApprove: called after customer click accept payment on PayPal popup, start capturing order by access serverAPIs
 *Note: server APIs can be PayPal directly or built-in application*

### Backend Development
**Framework of choice**: Express
**Authentication and authorization**: Session-based, Email-password
**Library and modules**: 
* mongoose: Connect to MongoDB using SDK to create schema, query or modify databases
* express-session: Express framerork default tools to handle logged-in user session, using set-cookie to automatically modify client cookies, having memory leaks occur
* cors: handle cross-origin reference authorization
* socket-io: server library for socketIO, handle abstracted WebSocket connection

## Installment Guide
***
1. Change to "React Client" directory, install package and run **yarn start**. An recommened alternative is accessing to this [deployment link](https://immense-scrubland-27295.herokuapp.com/) to act as HTTPS Client if not knowing how to create self-signed certificate for client localhost yet
2. Change to "Express Server" directory, install package and run **yarn start** for production mode with nodemon flexibility, the code will be in HTTPS version for testing secured connection
..*Note*: Since the CORS settings is set to allow different origin only (HTTPS demand), so the recommend setting is running heroku client with localhost:4000 server.
3. Import Init MongoDB Databases, for Cloud Mongo DB using [Atlas](https://www.mongodb.com/cloud)