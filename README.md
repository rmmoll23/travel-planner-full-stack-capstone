# Travel Planner Full Stack Capstone

Travel-planner-full-stack-capstone is an interactive full-stack web app that allows users to search for and choose places to eat, things to do, and trails to hike in the location they are visiting, and save them in a daily planner covering the length of their trip.  

# Live previews
* with Node can be found here https://travel-planner-capstone.herokuapp.com/ and 
* with React here https://rmmoll23.github.io/travel-planner-full-stack-capstone-react/build

WireFrames:
![travel-planner-landing-page](https://github.com/rmmoll23/travel-planner-full-stack-capstone/blob/master/github-images/travel-planner-landing-page.png)
![travel-planner-sign-up-page](https://github.com/rmmoll23/travel-planner-full-stack-capstone/blob/master/github-images/travel-planner-sign-up-page.png)
![travel-planner-log-in-page](https://github.com/rmmoll23/travel-planner-full-stack-capstone/blob/master/github-images/travel-planner-log-in-page.png)
![travel-planner-profile-page](https://github.com/rmmoll23/travel-planner-full-stack-capstone/blob/master/github-images/travel-planner-profile-page.png)
![travel-planner-new-trip-form](https://github.com/rmmoll23/travel-planner-full-stack-capstone/blob/master/github-images/travel-planner-new-trip-form.png)
![travel-planner-activity-selection-page](https://github.com/rmmoll23/travel-planner-full-stack-capstone/blob/master/github-images/travel-planner-activity-selection-page.png)
![travel-planner-trip-planner-page](https://github.com/rmmoll23/travel-planner-full-stack-capstone/blob/master/github-images/travel-planner-trip-planner-page.png)
![travel-planner-day-view-page](https://github.com/rmmoll23/travel-planner-full-stack-capstone/blob/master/github-images/travel-planner-day-view-page.png)
![travel-planner-packing-list-page](https://github.com/rmmoll23/travel-planner-full-stack-capstone/blob/master/github-images/travel-planner-packing-list-page.png)
![travel-planner-footer-view](https://github.com/rmmoll23/travel-planner-full-stack-capstone/blob/master/github-images/travel-planner-footer-view.png)

ScreenShots:
<img width="1440" alt="landingpage" src="https://user-images.githubusercontent.com/33381445/40890954-9fee0db6-6743-11e8-8419-0b67733aeccf.png">
<img width="1440" alt="signuppage" src="https://user-images.githubusercontent.com/33381445/40890959-ad04dd86-6743-11e8-9994-cbc4cded4c6b.png">
<img width="1440" alt="loginpage" src="https://user-images.githubusercontent.com/33381445/40890961-aeee98bc-6743-11e8-8c34-072345b7e160.png">
<img width="1440" alt="profilepage" src="https://user-images.githubusercontent.com/33381445/40890962-b24d1b8c-6743-11e8-9e5f-8c736d6079bc.png">
<img width="1440" alt="createtrippage" src="https://user-images.githubusercontent.com/33381445/40890963-b3b89456-6743-11e8-81d0-8d345cbb6b5e.png">
<img width="1440" alt="activityselectionpage" src="https://user-images.githubusercontent.com/33381445/40890964-b6b45d84-6743-11e8-93a6-ef19ac98db2f.png">
<img width="1440" alt="travelplannerpage" src="https://user-images.githubusercontent.com/33381445/40890966-b8f2018c-6743-11e8-8ad2-2549016b0d00.png">
<img width="1440" alt="dayactivitypage" src="https://user-images.githubusercontent.com/33381445/40890967-bb129850-6743-11e8-82b9-9aa43e735bfc.png">
<img width="1440" alt="packinglistpage" src="https://user-images.githubusercontent.com/33381445/40890968-bd1ca186-6743-11e8-808b-f608068dc2aa.png">


Summary: 
landingPage-
On this page the user has the ability to see the project description and choose to log in or sign up.  Clicking on either of these buttons will take the user to that respective page.  Also, in the footer, is a link to my github,linkedin, and gmail. 

signUpPage-
On this page the user has the ability to register for the app.  The user will see a form where they can enter a username, email, password, and confirm their password in order to sign up.  Once clicking the submit button, the user's information will be saved, and the user will be able to log in with their email and password moving forward.  If the user clicks on the cancel button, they will be returned to the landing page.  There is also a link at the bottom of the form that the user can click to log in if they already have an account. Clicking this link will take them to the log in page.  Also, in the footer is a link to my github, linkedin, and gmail.  

logInPage-
On this page the user will have the ability to log in.  They must enter their email and password.  After hitting the log in button, the email and password entered will be verified.  If they pass, the user will be directed to the profile page.  There is also a link at the bottom of the form that the user can click to sign up if they don't have an account. Clicking this link will take them to the sign up page. Also, in the footer is a link to my github, linkedin, and gmail.

profilePage-
The profile page will have a welcome message for the user.  The user will be able to see any past trips they have created on the app.  If the user clicks on one of these pages, the user will be directed to the trip planner page of that trip.  If the user clicks on the button create new trip, they will be directed to the new trip form. Also, in the footer is a link to my github, linkedin, and gmail. 

newTripForm-
This view will give the user the ability to create a new trip.  The user will input a name for their trip, the city their trip will be located in, a trip start date, and an end date.  When clicking inside the input for the dates, a calendar will pop up to more easily select the desired start and end dates. When the user hits submit, they will be taken to the activity selection page.  When the user hits cancel they will be returned to the profile page.  Also, in the footer is a link to my github, linkedin, and gmail. 

activitySelectionPage-
The user will initially see the name of their trip and number of days of the trip as the header of this page.  A nav bar will be present at the top of the page with links directing the user to the profile page, the packing list page, the trip planner page, or the landing page.  The user will see a horizontal bar depicting a weather forecast for each day of their trip in the city they input below the header.  Below the weather, the user will see three containers:  restaurants, things to do, and hiking trails.  Things to do will have an input bar to search for anything from the google places API.  This search will return results for that category ordered by their rank.  Restaurants and Hiking trails will return results based on the city location.  For each item in all three containers, the user will have the ability to click a drop down to select a day they would like to add that item into their planner.  Once selecting the day, the user can click add to planner to post the item to that day of the planner.  At the bottom of the page will be two buttons, view trip planner and create packing list.  They will each direct the user to their respective pages when clicked.  Also, in the footer is a link to my github, linkedin, and gmail. 

tripPlannerPage-
This page will show the user a layout of all days of their trip.  Each day container will show the user how many items have been saved to that day. A nav bar will be present at the top of the page with links directing the user to the profile page, the packing list page, the activity selection page, or the landing page. There will be text in the header directing the user to select a day to view more details.  Clicking on a day container will take the user to the day view page for that particular day.  Also, in the footer is a link to my github, linkedin, and gmail. 

dayViewPage-
On this page, the user will see their trip, followed by the day they are viewing, in the header.  The user will also see a weather icon and a high and low temp for that day in the header.  A nav bar will be present at the top of the page with links directing the user to the profile page, the packing list page, the trip planner page, or the landing page. Beneath the header, the user will see a container for each item that they have saved.  They will see the name of their item, which will be a clickable link to that item's webpage.  They will see the address of that item below the name.  There is a delete button below the address where the user can remove that item from that day.  Also in that container will be a text box that the user can edit.  This textbox can be used for any notes for the item. Also, in the footer is a link to my github, linkedin, and gmail. 

packingListPage-
This page will give the user the ability to manage their packing list for their trip.  It will show a default generated list will multiple categories already displayed.  This will give the user a good starting point for general packing items.  There will be an add item button at the bottom of every category's list that will give the user the ability to add another item to that category.  Each list item will have a check box that can be checked or unchecked, as well as a delete button to the right, which will remove the item from the list.  A nav bar will be present at the top of the page with links directing the user to the profile page, the activity selection page, the trip planner page, or the landing page.  Also, in the footer is a link to my github,linkedin, and gmail. 

Technical:
Travel-planner-full-stack-capstone was built as two separate parts.

Front End-
HTML5
CSS3
JavaScript
jQuery 
REACT

Back End-
Node.js
Express.js
MongoDB
Mongoose
mLab database
Mocha and Chai for testing 


## Node command lines
* npm install ==> install all node modules
* nodemon server.js ==> run node server
* npm test ==> run the tests

## React command lines
* npm install ==> install all node modules
* npm run build ==> build the react files in the "build" folder
* npm start ==> run react server on http://127.0.0.1:8080
* npm test ==> run the tests