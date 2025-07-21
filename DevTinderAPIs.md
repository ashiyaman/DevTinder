#DevTinder APIs

##authRouter
- POST /signup
- POST /login
- POST /logout

##profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

##connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userid
- POST request/review/accepted/:requestId
- POST request/review/rejected/:requestId

userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets the profile of other users

status: ignore, interested, accepted, rejected