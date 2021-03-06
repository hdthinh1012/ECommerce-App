# ECommerce-App
## Description 
Simple monolothic web application provides thorough eCommerce shopping process for customer. Features provided contains:
* Simple Menu Page
* Built-in cart with add or remove items actions
* Review Cart Page
* Register, login account with email (verification not supported yet)
* Integrated PayPal API (sandbox only) for creating and capturing orders from between Customer account and Business Account
* Chat system between online logged-in customers.

## Technical Choice
### Authentication and Authorization
***
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
***
* Password is hashed with salt before storing to databse  
* HTTPS with Certificate connection is currently developed

### Database Management System
***
**Database**: MongoDB  
**Connecting Modules**: Mongoose  
**Current Collection**: User, Category, Funiture, Order, ChatBox

### Frontend Development
***
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
***
**Framework of choice**: Express  
**Authentication and authorization**: Session-based, Email-password  
**Library and modules**:   
* mongoose: Connect to MongoDB using SDK to create schema, query or modify databases
* express-session: Express framerork default tools to handle logged-in user session, using set-cookie to automatically modify client cookies, having memory leaks occur
* cors: handle cross-origin reference authorization
* socket-io: server library for socketIO, handle abstracted WebSocket connection

## Installment Guide
1. Change to "React Client" directory, install package and run **yarn start**. An not-so-recommened alternative is accessing to this [deployment link](https://immense-scrubland-27295.herokuapp.com/) to act as HTTPS Client if not knowing how to create self-signed certificate for client localhost yet
2. Change to "Express Server" directory, install package and run **yarn start** for production mode with nodemon flexibility, the code will be in HTTPS version for testing secured connection. A recommended alternative is changing front-end .env SERVER URL to server deployment link *https://powerful-scrubland-94123.herokuapp.com*.  
..*Note*: Since the CORS settings is set to allow different origin only (HTTPS demand), so the recommend setting is running heroku server with localhost:3000 client.
3. Import Init MongoDB Databases, for Cloud Mongo DB using [Atlas](https://www.mongodb.com/cloud)

## Deployment Guide
* Heroku Multi Monorepo Guide [here](https://blog.softup.co/how-to-deploy-a-monorepo-to-multiple-heroku-apps-using-github-actions/)

### PayPal Integration Guide
Login to PayPal Developer Page and access to *https://developer.paypal.com/developer/applications* for getting Client-ID and Secret from the business account to get Access Token from oAuth 2.0 protocol.

Application can integrated with one PayPal business account at a time only.


## Problems related to socket:
* Is the ChatBox is created automatically when 2 new users first meet each other by online the same times. *Done*
* Is the ChatBox is automatically add or remove when the opposite user move in / out of the ChatPage *Done*
* Is the no ChatBox currently to choose (mean no other online users) is handle to not avoiding reading _id of null user when searching for currently-chosen-by-SocketOwner ChatBox *Done*
* Timing of two dispatched action chat.initiateChatSocket and chat.initiateEventListener of the Socket causing occasion occuring ChatBox with the same player since the SocketOwnerId use to filter out the current user is not yet initialized  
Video demo of the issue:  
<a href="http://www.youtube.com/watch?feature=player_embedded&v=sX3jX9Cm4-I
" target="_blank"><img src="http://img.youtube.com/vi/sX3jX9Cm4-I/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>