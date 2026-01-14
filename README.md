🟣 GigFlow 🧑‍💻💼:

Mini Freelance Marketplace Platform

GigFlow is a mini freelance marketplace where users can post jobs (Gigs) and apply to them (Bids).
The project focuses on secure authentication, complex database relationships, and robust hiring logic.

🚀 *Tech Stack:*

• _Backend_ -

Node.jsExpress.js,MongoDB + Mongoose,JWT Authentication (HttpOnly Cookies),Socket.io (prepared for real-time notifications)

• _Frontend_ -

React (Vite),Tailwind CSS,Axios,Context API

✅ Core Features Implemented:

🔐 *Authentication-*

--Secure Register / Login

--JWT stored in HttpOnly cookies

--Protected routes using middleware

Role-fluid system (any user can be Client or Freelancer)

📌 *Gig Managemen* t-

--Create gigs (protected)

--Browse all open gigs (public)

--Gig status: open → assigned

💬 *Bidding System:*

--Freelancers can bid on gigs

--Clients can view all bids for their gigs

--Bid status: pending, hired, rejected

🧠 *Hiring Logic* (Crucial):

•When a client hires a freelancer-

(Gig status changes to assigned

Selected bid → hired

All other bids → rejected

Authorization check ensures only the gig owner can hire)


This logic is fully implemented and tested.

🧪 *API Testing* :

All backend features were tested using Thunder Client / Postman, including:

--User registration & login

--Gig creation

--Bid submission

--Hiring workflow

" *_Screenshots can be provided if required."_*



⚠️ *Frontend Status (Important Note)*

Due to time constraints, the backend is fully completed and tested.
The frontend UI is partially implemented; however, CORS and cookie-based authentication issues prevented final end-to-end integration within the allotted time.

All core business logic (Auth, Gigs, Bids, Hiring flow) is complete and functional via API testing.

With additional time, frontend integration would be finalized.
