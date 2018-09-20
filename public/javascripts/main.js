'use strict';

let store = {
  username: '',
  tripName: '',
  tripLength: '',
  location: '',
  latitude: '',
  longitude: ''
}


  
  const serverBase = 'https://travel-planner-capstone.herokuapp.com';
  // const serverBase = '';
  
  
  // API Calls
function getWeatherForecast(locationKey){
    $.getJSON(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=VFDAkPsWGspNGI0hnUmmssJqqUxWZgJn`)
    // .done(callback)
    .done(function(result) {
      // console.log(result);
      displayWeatherResults(result);
    })
    .fail(function(err){
        // console.log(err)
    });
}

function getLocationKey(city) {
  $.getJSON(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=VFDAkPsWGspNGI0hnUmmssJqqUxWZgJn&q=${city}`)
  // .done(callback)
  .done(function(result) {
    renderLocationKey(result);
  })
  .fail(function(err){
      // console.log(err)
  });
}

function getLatLon(city){
    $.ajax({
      url: `https://developers.zomato.com/api/v2.1/locations?query=${city}`,
      type: 'GET',
      dataType: 'json',
      headers: {
        'user-key': '3487285e21b6370abf8d29bfc2bb0a29'
    }
    })
    .done(function(result) {
      renderLatLon(result);
    })
    .fail(function(err){
        // console.log(err)
    });
  }


function getRestaurants(lat, lon, startNumber){
  $.ajax({
    url: `https://developers.zomato.com/api/v2.1/search?start=${startNumber}&count=60&lat=${lat}&lon=${lon}&sort=rating&order=desc`,
    type: 'GET',
    dataType: 'json',
    headers: {
      'user-key': '3487285e21b6370abf8d29bfc2bb0a29'
  }
  })
    .done(function(result) {
      displayRestaurantResults(result);
      displayDayDropDown()
    })
    .fail(function(err){
        // console.log(err)
    });
}

function getHikingTrails(lat, lon){
  $.ajax({
    url: `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=50&maxResults=40&sort=quality&key=200240688-9f702ff0e042839c3e70ab4f893b733f`,
    type: 'GET',
    dataType: 'json',
  })
    .done(function(result) {
      // console.log(result);
      displayHikingTrailsResults(result);
    })
    .fail(function(err){
        // console.log(err)
    });
}

// Render and Display API results

function renderLocationKey (data) {
  const locationKey = data[0].Key;
  getWeatherForecast(locationKey);
}

function renderLatLon(data) {
  const lat = data.location_suggestions[0].latitude;
  const lon = data.location_suggestions[0].longitude;
  localStorage.setItem("lat", lat);
  localStorage.setItem("lon", lon);
  store.latitude = lat;
  store.longitude = lon;
  getRestaurants(lat, lon, 0);
  getRestaurants(lat, lon, 20);
  getRestaurants(lat, lon, 40);
  initSearch(lat, lon, 'things to do');
  getHikingTrails(lat, lon);
}

function displayRestaurantResults(data) {
  const restaurantResults = data.restaurants.map((items, index) => renderRestaurantResults(items,index));
  $(".restaurantContainer").append(restaurantResults);
}

function renderRestaurantResults(items, index) {
  const restaurantName = items.restaurant.name;
  const restaurantAddress = items.restaurant.location.address;
  const restaurantURL = items.restaurant.url;
  const type = items.restaurant.cuisines;
  const rating = items.restaurant.user_rating.aggregate_rating;

  let restaurantResults = '<div class="restaurantResults">';
  restaurantResults += `<p>Name: <span id="restaurantName"><a href="${restaurantURL}" target="_blank">${restaurantName}</a></span></p>`;
  restaurantResults += `<p>Rating: <span>${rating}/5</span></p>`;
  restaurantResults += `<p>Type: <span>${type}</span></p>`;
  restaurantResults += `<p>Address: <span id="restaurantAddress">${restaurantAddress}</span></p>`;
  restaurantResults += '<select class="dayDropDown" name="days">';
            
  restaurantResults += '</select>'
  restaurantResults += '<button id="addToPlanner" type="submit">Add to Planner</button>';
  restaurantResults += '</div>';
return restaurantResults;
}


function displayHikingTrailsResults(data) {
  const hikingTrailsResults = data.trails.map((trail, index) => renderHikingTrailsResults(trail,index));
  $(".hikeContainer").html(hikingTrailsResults);
}

function renderHikingTrailsResults(trail, index) {
  const trailsName = trail.name;
  const trailsURL = trail.url;
  const length = trail.length;
  const trailLocation = trail.location;
  const trailRating = trail.stars;
  let difficulty = trail.difficulty;

  if (difficulty === "black") {
    difficulty = "difficult";
  }

  if (difficulty === "blue") {
    difficulty = "moderate";
  }

  if (difficulty === "green") {
    difficulty = "easy";
  }

  if (difficulty === "blueBlack") {
    difficulty = "moderately difficult";
  }

  if (difficulty === "greenBlue") {
    difficulty = "moderately easy";
  }

  let hikingTrailsResults = '<div class="hikeResults">';
  hikingTrailsResults += `<p>Name: <span id="trailName"><a href="${trailsURL}" target="_blank">${trailsName}</a></span></p>`;
  hikingTrailsResults += `<p>Length: <span>${length} miles</span></p>`;
  hikingTrailsResults += `<p>Difficulty: <span>${difficulty}</span></p>`;
  hikingTrailsResults += `<p>Rating: <span>${trailRating}/5</span></p>`;
  hikingTrailsResults += `<p>Location: <span id="trailLocation">${trailLocation}</span></p>`;
  hikingTrailsResults += '<select class="dayDropDown" name="days">';

  hikingTrailsResults += '</select>';
  hikingTrailsResults += '<button id="addToPlanner" type="submit">Add to Planner</button>';       
  hikingTrailsResults += '</div>';
return hikingTrailsResults;
}

function displayWeatherResults(data) {
  const weatherResults = data.DailyForecasts.map((forecast, index) => renderWeatherResults(forecast,index));
  $(".weatherBar").html(weatherResults);
}

function renderWeatherResults(forecast, index) {
  const low = forecast.Temperature.Minimum.Value;
  const high = forecast.Temperature.Maximum.Value;

  let weatherIcon = forecast.Day.Icon;
  if (weatherIcon < 10) {
    weatherIcon = '0' + weatherIcon;
  }

  const time = forecast.EpochDate;
  const myDate = new Date( time *1000);
  const options = {year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = myDate.toLocaleString('en-US', options);
 
  const weatherResults = `<div class="weatherContainer">
    <h3>${currentDate}</h3>
    <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon}-s.png"/>
    <p>High: <span>${high}</span></p>
    <p>Low: <span>${low}</span></p>
    </div>`;
return weatherResults;
}

// CRUD Operations
// User Requests
function getFirstName(username) {
  // console.log('Retrieving tripList')
  const userURL = serverBase + `/api/users/${username}`;
  $.getJSON(userURL, function(user) {
    // console.log(user);
    const firstName = user.firstName;
    $('#firstName').html(firstName);
  })
}


// Trip Requests
function createTripPost(name, city, username, tripLength) {
  // console.log('tripToDatabase');
      $('html').loader('show');

      const createTripObject = {
        username: username,
        tripName: name,
        location: city,
        tripLength: tripLength
      };

      $.ajax({
        type: 'POST',
        url: serverBase + '/trips',
        dataType: 'json',
        data: JSON.stringify(createTripObject),
        contentType: 'application/json'
      })
      .fail(function(error) {
        // console.log(error)
      })
      .done(function (result) {
        // console.log(result);
        // console.log('tripCreated');
        $('#tripName').val('');
        $('#tripLocation').val('');
        $('#from').val('');
        $('to').val('');
        $('#noTrips').addClass('hidden');
        $('#tripList').append(`<li><a href="#">${result.tripName}</a><div title="delete trip" class="deleteTrip"><i class="fa fa-close"></i></div></li>`);
        $('.newTrip').addClass('hidden');
        $('.activitySelection').removeClass('hidden');
        $('.navList').removeClass('hidden');
        $('.links').removeClass('current');
        $('#activityNav').addClass('current');
        $('html').loader('hide');
      })
    }

    function getTripList(username) {
        // console.log('Retrieving tripList')
        const tripListURL = serverBase + `/trips/${username}`;
        $.getJSON(tripListURL, function(trips) {
          const tripList = trips.map(function(trip) {
            const tripListTemplate = 
              `<li><a href="#">${trip.tripName}</a><div title="delete trip" class="deleteTrip"><i class="fa fa-close"></i></div></li>`;
            return tripListTemplate;
          })
          console.log(tripList);
          if (tripList.length === 0) {
            $('#noTrips').removeClass('hidden');
          }
          else {
            $('#tripList').append(tripList);
          }
        });
      }

   function deleteTrip(tripName) {
    const username = localStorage.getItem("username");
    store.username = username;
    console.log(username);
    $.ajax({
          url: serverBase + `/trips/${username}/${tripName}`,
          method: 'DELETE',
        })
        .done(function(data) {
          console.log('deleted trip');
        })
        .fail(function (jqXHR, error, errorThrown) {
          console.log(jqXHR);
          console.log(error);
          console.log(errorThrown);
          const alertError = 'Error encountered in DELETE.';
          alertUser(alertError);
        })
   }

   function getTrip(name) {
    // console.log(`Retrieving trip ${name}`);
    $('html').loader('show');
    const tripName = name.replace(' ', '-');
    const username = localStorage.getItem('username');
    const getTripURL = serverBase + `/trips/${username}/${tripName}`;
    
    $.getJSON(getTripURL, function(trip) {
      store.username = trip.username;
      store.tripLength = trip.tripLength;
      store.location = trip.location;
      store.tripName = trip.tripName;
      // console.log(trip)
      return trip;
      })
      .done(function(result) {
      // console.log('success')
      getLatLon(result.location);
      getLocationKey(result.location);
      displayTripHeaders();
      displayTravelPlanner();
      displayDayView();
      getActivities();
      getPackingListItems();
      $('html').loader('hide');
      })
      .fail(function(error) {
        // console.log(error);
      })
      $('.profile').addClass('hidden');
      $('.activitySelection').removeClass('hidden');
      $('.navList').removeClass('hidden');
      $('.links').removeClass('current');
      $('#activityNav').addClass('current');
    }

    // Activity Requests
    function postActivity(name, address, day, url) {
      // console.log('activityToDatabase');
    
          const createActivityObject = {
            tripName: store.tripName,
            activityName: name,
            username: store.username,
            activityURL: url,
            address: address,
            day: day,
            notes: ''
          };
    
          $.ajax({
            type: 'POST',
            url: serverBase + '/activities',
            dataType: 'json',
            data: JSON.stringify(createActivityObject),
            contentType: 'application/json'
          })
          .fail(function(error) {
            // console.log(error)
          })
          .done(function (result) {
            // console.log('activityPosted');
          })
        }

    function getActivities() {
        // console.log('Retrieving activityList')
        const username = store.username; 
        const days = store.tripLength; 
        const location = store.location; 
        const name = store.tripName;  
        const activityListURL = serverBase + `/activities/${username}/${name}`;
        $.getJSON(activityListURL, function(activities) {
          const activityList = activities.map(function(activity) {
            const activityURL = activity.activityURL;
            const activityName = activity.activityName;
            const address = activity.address;
            let day = activity.day;
            day = `.day${day}`;
            const notes = activity.notes;
            displayDayViewContent(activityName, address, day, activityURL, notes);
          })
        });
      }

      function deleteActivity(tripName, activityName, day) {
        // console.log(tripName, activityName, day);
        const username = store.username;
        $.ajax({
              url: serverBase + `/activities/${username}/${tripName}/${activityName}/${day}`,
              method: 'DELETE',
            })
            .done(function(data) {
              // console.log('success');
            })
            .fail(function (jqXHR, error, errorThrown) {
              // console.log(jqXHR);
              // console.log(error);
              // console.log(errorThrown);
              const alertError = 'Error encountered in DELETE.';
              alertUser(alertError);
            })
      }

      function updateNotes(day, activityName, notes, name) {
        const username = store.username;
       
        $.ajax({
              url: serverBase + `/activities/${username}/${name}/${activityName}/${day}`,
              method: 'PUT',
              data: `notes=${notes}`,
            })
            .done(function(data) {
              // console.log('success');
            })
      }

      // packingList
      function postItemToPackingList(itemAdded, category) {
        // console.log('itemToDatabase');
        // console.log(store.username);
    
          const createItemObject = {
            tripName: store.tripName,
            category: category,
            username: store.username,
            itemName: itemAdded,
            checked: "on"
          };

          // console.log(createItemObject);
    
          $.ajax({
            type: 'POST',
            url: serverBase + '/items',
            dataType: 'json',
            data: JSON.stringify(createItemObject),
            contentType: 'application/json'
          })
          .fail(function(error) {
            // console.log(error)
          })
          .done(function (result) {
            // console.log('itemPosted');
            // console.log(result);
          })
      }

      function getPackingListItems() {
        // console.log('Retrieving packingList')
        const username = store.username;
        const tripName = store.tripName;
        // console.log(tripName);
        const packingListURL = serverBase + `/items/${username}/${tripName}`;
        $.getJSON(packingListURL, function(items) {
          const itemList = items.map(function(item) {
            const newItem = 
            `<div class="items"><label><input type="checkbox" name="${item.itemName}">${item.itemName}</label><div aria-label="select to delete ${item.itemName} from list" class="delete"><i class="fa fa-close"></i></div><br></div>`;
            const itemClass = `.${item.category}`;
            $(itemClass).append(newItem);
            if (item.checked === 'on') {
              // console.log(item.itemName);
              $(`input[name='${item.itemName}']`).prop('checked', true);
            }
          });


        })
        .fail(function(err) {
          // console.log(error);
        })
        .done(function(result) {
          // console.log('success');
        })
      }

      function deletePackingListItem(itemName, category) {
        const tripName = store.tripName;
        const username = store.username;
        itemName = itemName.trim();
        // console.log(itemName + 'hello');
        $.ajax({
              url: serverBase + `/items/${username}/${tripName}/${itemName}/${category}`,
              method: 'DELETE',
            })
            .done(function(data) {
              console.log('success deleted item');
            })
            .fail(function (jqXHR, error, errorThrown) {
              console.log(jqXHR);
              console.log(error);
              console.log(errorThrown);
              const alertError = 'Error encountered in DELETE.';
              alertUser(alertError);
            })
      }

      function updatePackingListItem(itemName, category, checked) {
        console.log(checked);
        const username = store.username;
        const tripName = store.tripName;
        const item = itemName.trim();
       
        $.ajax({
              url: serverBase + `/items/${username}/${tripName}/${item }/${category}`,
              method: 'PUT',
              data: `checked=${checked}`,
            })
            .done(function(data) {
              console.log('success updated checked item');
            })
            .fail(function (jqXHR, error, errorThrown) {
              console.log(jqXHR);
              console.log(error);
              console.log(errorThrown);
              const alertError = 'Error encountered in DELETE.';
              alertUser(alertError);
            })
            
      }

  

  function dateDifference() {
    let date1 = $('#from').val();
    console.log(date1);
    let date2 = $('#to').val();
    console.log(date2);
    if (date1 === '') {
      alert('Must enter a start date');
    }
    if (date2 === '') {
      alert('Must enter an end date');
    }
    date1 = date1.replace(/\b0/g, '');
    const date1array = date1.split("/");
    console.log(date1array);
    date1 = new Date(date1array[0], date1array[1], date1array[2]);
    date2 = date2.replace(/\b0/g, '');
    const date2array = date2.split("/");
    console.log(date2array);
    date2 = new Date(date2array[0], date2array[1], date2array[2]);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));  
    console.log(diffDays);
    localStorage.setItem("tripLength", diffDays);
    store.tripLength = diffDays;
    
  }

  // Displays headers on each view
  function displayTripHeaders() {
    // const name = localStorage.getItem("tripName");
    const name = store.tripName;
    // const length = localStorage.getItem("tripLength");
    const length = store.tripLength;
    // console.log(name, length);
    const headerText = `${name} (${length} days)`;
    $('.viewHeader').html(headerText);
  }

  // Displays day drop down in search containers
  function displayDayDropDown() {
    
    // const days = localStorage.getItem("tripLength");
    const days = store.tripLength;
    let dropDown = '';
    for (let i = 1; i <= days; i++) {
      dropDown += `<option class="dropDownDay${i}" value="day${i}">Day ${i}</option>`;
    }
    $('.dayDropDown').html(dropDown);
  }

  function displayTravelPlanner() {
    // const days = localStorage.getItem("tripLength");
    const days = store.tripLength;
    let dayContainer = '';
    for (let i = 1; i <= days; i++) {
      dayContainer += `<div class="dayContainer plannerDay${i}">
            <h3 >Day ${i}</h3>
            <p >0 activities saved</p>
        </div>`;
    }
    $('.plannerDays').html(dayContainer);
  }

  function displayDayView() {
    // const days = localStorage.getItem("tripLength");
    const days = store.tripLength;
    // const name = localStorage.getItem("tripName");
    const name = store.tripName;
    let dayView = '';
    for (let i = 1; i <= days; i++) {
      dayView += `<div class="dayPage day${i} hidden"><h1 class="dayHeader">${name} (Day ${i})</h1>
      <div class="activities">
        <h3 class="noActivities">No activities added to this day.  Go to Activity Selection Page to add activities.</h3>
      </div>
      </div>`
    }
    $('.dayView').html(dayView);
  }

  function displayDayViewContent(name, address, daySelected, url, notes) {
    let dayViewContent = '';
    const days = store.tripLength;
    let dropDown = '';
    for (let i = 1; i <= days; i++) {
      dropDown += `<option class="dropDownDay${i}" value="day${i}">Day ${i}</option>`;
    }
    if (url === undefined) {
      dayViewContent = `<div class="dayActivity">
      <h2>${name}</h2>
      <p>${address}</p><br>
      <button class="button-delete" type="button">Delete</button>
      <select class="dayActivityDropDown" name="days">${dropDown}</select>
      <button id="changeActivityDay" type="submit">Move Activity</button>
      <textarea rows="4" cols="50" class="notesInput">${notes} 
      </textarea>
      <button class="button-notes" type="button">Save Notes</button>
      </div>`
    }
    else {
      dayViewContent = `<div class="dayActivity">
      <h2><a href="${url}" target="_blank">${name}</a></h2>
      <p>${address}</p><br>
      <button class="button-delete" type="button">Delete</button>
      <select class="dayActivityDropDown" name="days">${dropDown}</select>
      <button id="changeActivityDay" type="submit">Move Activity</button>
      <textarea rows="4" cols="50" class="notesInput">${notes} 
      </textarea>
      <button class="button-notes" type="button">Save Notes</button>
      </div>`
    }
    $(`${daySelected}`).find('.activities').append(dayViewContent);
    $(`${daySelected}`).find('.activities').find('.noActivities').addClass('hidden');
    activityCount(daySelected);
  }

  // activityCount
  function activityCount(daySelected) {

    // console.log(`count for ${daySelected}`);
    const itemCount = $(`${daySelected}`).find('.activities').children('.dayActivity').length;
    console.log(itemCount);
      // console.log(itemCount);
      const day = daySelected.replace(/\D/g,'');

      const activityCount = `<p>${itemCount} activities saved</p>`;
      // console.log(activityCount);
      $(`.plannerDay${day}`).find('p').html(activityCount);
  }
  
  
  function handleEventListeners() {

    // landing listeners

    $(document).on('click', '#signUp-button', function(event) {
      event.preventDefault();
      // console.log('signUp');
      $('.landing').addClass('hidden');
      $('#logIn-button').addClass('hidden');
      $('#signUpButtonNav').addClass('hidden');
      $('.signUp').removeClass('hidden');
    });

    $(document).on('click', '#signUpButtonNav', function(event) {
      event.preventDefault();
      console.log('signUp');
      $('.landing').addClass('hidden');
      $('#logIn-button').addClass('hidden');
      $('#signUpButtonNav').addClass('hidden');
      $('.signUp').removeClass('hidden');
    });


    // Example Event Delegation for REACT*****
    $(document).on('click', '#logIn-button', function(event) {
      event.preventDefault();
      // console.log('logIn');
      $('.landing').addClass('hidden');
      $('#logIn-button').addClass('hidden');
      $('#signUpButtonNav').addClass('hidden');
      $('.logIn').removeClass('hidden');
    });

    // example videos of site features
    $(document).on('click', '#searchSample', function(event) {
      event.preventDefault();
      if ($('#searchSample').hasClass('backgroundColor')) {
        $('#searchSample').removeClass('backgroundColor');
        $('#searchSampleVideo').addClass('hidden');
      }
      else {
        $('#searchSampleVideo').removeClass('hidden');
        $('#addToPlannerSampleVideo').addClass('hidden');
        $('#packingListSampleVideo').addClass('hidden');
        $('#searchSample').addClass('backgroundColor');
        $('#addToPlannerSample').removeClass('backgroundColor');
        $('#packingListSample').removeClass('backgroundColor');
      }
    });

    $(document).on('click', '#addToPlannerSample', function(event) {
      event.preventDefault();
      if ($('#addToPlannerSample').hasClass('backgroundColor')) {
        $('#addToPlannerSample').removeClass('backgroundColor');
        $('#addToPlannerSampleVideo').addClass('hidden');
      }
      else {
        $('#searchSampleVideo').addClass('hidden');
        $('#addToPlannerSampleVideo').removeClass('hidden');
        $('#packingListSampleVideo').addClass('hidden');
        $('#searchSample').removeClass('backgroundColor');
        $('#addToPlannerSample').addClass('backgroundColor');
        $('#packingListSample').removeClass('backgroundColor');
      }
    });

    $(document).on('click', '#packingListSample', function(event) {
      event.preventDefault();
      if ($('#packingListSample').hasClass('backgroundColor')) {
        $('#packingListSample').removeClass('backgroundColor');
        $('#packingListSampleVideo').addClass('hidden');
      }
      else {
        $('#searchSampleVideo').addClass('hidden');
        $('#addToPlannerSampleVideo').addClass('hidden');
        $('#packingListSampleVideo').removeClass('hidden');
        $('#searchSample').removeClass('backgroundColor');
        $('#addToPlannerSample').removeClass('backgroundColor');
        $('#packingListSample').addClass('backgroundColor');
      }
    });

    // change video sources based on window size
    $(function(){
      if ($(window).width() > 500) {
          $('#searchSampleVideo').attr('src','./images/activitySearchExample.mp4');
          $('#addToPlannerSampleVideo').attr('src','./images/addItemExample.mp4');
          $('#packingListSampleVideo').attr('src','./images/packingListExample.mp4');
      }
      else if ($(window).width() < 500) {
          $('#searchSampleVideo').attr('src','./images/searchExamplePhone.mp4');
          $('#addToPlannerSampleVideo').attr('src','./images/addItemToPlannerExamplePhone.mp4');
          $('#packingListSampleVideo').attr('src','./images/packingListExamplePhone.mp4');
      }
  });

    // signUp listeners

    $(document).on('click', '#cancel', function(event) {
      event.preventDefault();
      // console.log('signUp');
      $('.signUp').addClass('hidden');
      $('#logIn-button').removeClass('hidden');
      $('#signUpButtonNav').removeClass('hidden');
      $('.landing').removeClass('hidden');
    });

    $(document).on('click', '#toLogIn', function(event) {
      event.preventDefault();
      // console.log('signUp');
      $('.signUp').addClass('hidden');
      $('.logIn').removeClass('hidden');
    });

    // logIn listeners

    $(document).on('click', '#cancelLogIn', function(event) {
      event.preventDefault();
      // console.log('signUp');
      $('.logIn').addClass('hidden');
      $('#logIn-button').removeClass('hidden');
      $('#signUpButtonNav').removeClass('hidden');
      $('.landing').removeClass('hidden');
    });

    $(document).on('click', '#toSignUp', function(event) {
      event.preventDefault();
      // console.log('signUp');
      $('.logIn').addClass('hidden');
      $('.signUp').removeClass('hidden');
    });

    // profile listeners

    $(document).on('click', '#newTrip', function(event) {
      event.preventDefault();
      // console.log('newTripForm');
      $('.profile').addClass('hidden');
      $('.newTrip').removeClass('hidden');
    });

    $(document).on('click', '#tripList a', function(event) {
      event.preventDefault();
      const name = $(this).text();
      // console.log(name);
      getTrip(name);
    })

    $(document).on('click', '#tripList .deleteTrip', function(event) {
      event.preventDefault();
      // console.log('delete');
      const tripName = $(this).parent('li').find('a').html();

      var result = confirm("Are you sure you want to delete this trip?");
      if (result) {
        //Logic to delete the item
        console.log(tripName);
        $(this).parent('li').remove();
        deleteTrip(tripName);
      }
    });

    // newTrip listeners 

    $(document).on('click', '#createTrip', function(event) {
      event.preventDefault();
      const name = $('#tripName').val().trim();
      const city = $('#tripLocation').val().trim();
      if (name === '') {
        alert('Must enter a trip name');
      }

      else if (city === '') {
        alert('Must enter the name of a city');
      }

      else {
      const username = localStorage.getItem("username");
      store.username = username;
      store.tripName = name;

      // console.log(city);
      getLatLon(city);
      getLocationKey(city);
      dateDifference();
      displayTripHeaders();
      displayTravelPlanner();
      displayDayView();
      getPackingListItems();
      const tripLength = store.tripLength;



      createTripPost(name, city, username, tripLength);
      }
    });

    $(document).on('click', '#cancelTrip', function(event) {
      event.preventDefault();
      // console.log('signUp');
      $('.newTrip').addClass('hidden');
      $('.profile').removeClass('hidden');
    });

    // activitySelection listeners

    $(document).on('click', '#viewPlanner', function(event) {
      event.preventDefault();
      // console.log('viewTravelPlanner');
      $('.activitySelection').addClass('hidden');
      $('.tripPlanner').removeClass('hidden');
      $('.links').removeClass('current');
      $('#plannerNav').addClass('current');
    });

    $(document).on('click', '#createPackList', function(event) {
      event.preventDefault();
      // console.log('createPackingList');
      $('.activitySelection').addClass('hidden');
      $('.packingList').removeClass('hidden');
      $('.links').removeClass('current');
      $('#packingNav').addClass('current');
    });

    // tripPlanner listeners

    $(document).on('click', '.tripPlanner .dayContainer', function(event) {
      event.preventDefault();
      // console.log('dayView');
      let element = $(this).attr('class');
      element = element.replace(/\D/g,'');
      element = `.day${element}`;
      // console.log(element);
      
      
      $('.tripPlanner').addClass('hidden');
      $('.dayView').removeClass('hidden');
      $(element).removeClass('hidden');
      $('.links').removeClass('current');
    });

    // nav listeners

    $(document).on('click', '#profileNav', function(event) {
      event.preventDefault();
      console.log('toProfile');
      $('.activitySelection').addClass('hidden');
      $('.tripPlanner').addClass('hidden');
      $('.dayView').addClass('hidden');
      $('.packingList').addClass('hidden');
      const days = store.tripLength;
      for (let i = 1; i <= days; i++) {
        $(`.day${i}`).addClass('hidden');
      }
      $('.navList').addClass('hidden');
      $('.profile').removeClass('hidden');
      $('.links').removeClass('current');
      $('.itemList').empty();
      $('.activityResultsContainer').empty();
      $('.restaurantContainer').empty();
      $('.hikeContainer').empty();
    });

    $(document).on('click', '#plannerNav', function(event) {
      event.preventDefault();
      console.log('toPlanner');
      $('.activitySelection').addClass('hidden');
      $('.dayView').addClass('hidden');
      $('.packingList').addClass('hidden');
      const days = store.tripLength;
      for (let i = 1; i <= days; i++) {
        $(`.day${i}`).addClass('hidden');
      }
      $('.tripPlanner').removeClass('hidden');
      $('.links').removeClass('current');
      $('#plannerNav').addClass('current');
    });

    $(document).on('click', '#packingNav', function(event) {
      event.preventDefault();
      console.log('toPacking');
      $('.activitySelection').addClass('hidden');
      $('.tripPlanner').addClass('hidden');
      $('.dayView').addClass('hidden');
      const days = store.tripLength;
      for (let i = 1; i <= days; i++) {
        $(`.day${i}`).addClass('hidden');
      }
      $('.packingList').removeClass('hidden');
      $('.links').removeClass('current');
      $('#packingNav').addClass('current');
    });

    $(document).on('click', '#activityNav', function(event) {
      event.preventDefault();
      console.log('toActivity');
      $('.tripPlanner').addClass('hidden');
      $('.dayView').addClass('hidden');
      $('.packingList').addClass('hidden');
      const days = store.tripLength;
      for (let i = 1; i <= days; i++) {
        $(`.day${i}`).addClass('hidden');
      }
      $('.activitySelection').removeClass('hidden');
      $('.links').removeClass('current');
      $('#activityNav').addClass('current');
    });

    // activitySearchTriggers
    $(document).on('click', '.activityContainer #activitySearch-button', function(event) {
      event.preventDefault();
      const keyword = $('#activitySearch-input').val();
      const lat = +localStorage.getItem('lat');
      // const lat = +store.latitude;
      const lon = +localStorage.getItem('lon');
      // const lon = +store.longitude;
      // console.log(typeof +lat ,typeof +lon);

      $('.activityResultsContainer').html('');
      $('.activityResultsContainer').html('<h2 class="searchMessage">Searching...</h2>');
      initSearch(lat, lon, keyword);
      $('#activitySearch-input').val('');
    })

    // restaurants
    $(document).on('click', '.restaurantContainer #addToPlanner', function(event) {
      event.preventDefault();
      let daySelected = $(this).parent('.restaurantResults').find('select').val();
      daySelected = daySelected.replace(/\D/g,'');
      daySelected = `.day${daySelected}`;
      // console.log(daySelected);

      const name = $(this).parent('.restaurantResults').find('#restaurantName').text();
      const address = $(this).parent('.restaurantResults').find('#restaurantAddress').text();
      const url = $(this).parent('.restaurantResults').find('a').attr('href');
      let day = $(this).parent('.restaurantResults').find('select').val();
      day = day.replace(/\D/g,'');
      // console.log(name, address, url);
      const notes = '';
      displayDayViewContent(name, address, daySelected, url, notes);
      postActivity(name, address, day, url);
      alert(`Item added to planner`);
    });

    // search

    $(document).on('click', '.activityResultsContainer #addToPlanner', function(event) {
      event.preventDefault();
      let daySelected = $(this).parent('.activityResults').find('select').val();
      daySelected = daySelected.replace(/\D/g,'');
      daySelected = `.day${daySelected}`;
      // console.log(daySelected);

      const name = $(this).parent('.activityResults').find('#placeName').text();
      const address = $(this).parent('.activityResults').find('#placeAddress').text();
      const url = $(this).parent('.activityResults').find('a').attr('href');
      let day = $(this).parent('.activityResults').find('select').val();
      day = day.replace(/\D/g,'');
      // console.log(name, address, url);
      const notes = '';
      displayDayViewContent(name, address, daySelected, url, notes);
      postActivity(name, address, day, url);
      alert(`Item added to planner`);

    });

    // hiking

    $(document).on('click', '.hikeContainer #addToPlanner', function(event) {
      event.preventDefault();
      let daySelected = $(this).parent('.hikeResults').find('select').val();
      daySelected = daySelected.replace(/\D/g,'');
      daySelected = `.day${daySelected}`;
      // console.log(daySelected);

      const name = $(this).parent('.hikeResults').find('#trailName').text();
      const location = $(this).parent('.hikeResults').find('#trailLocation').text();
      const url = $(this).parent('.hikeResults').find('a').attr('href');
      let day = $(this).parent('.hikeResults').find('select').val();
      day = day.replace(/\D/g,'');
      // console.log(name, location, url);
      const notes = '';
      displayDayViewContent(name, location, daySelected, url, notes);
      postActivity(name, location, day, url);
      alert(`Item added to planner`);

    });


    // dayViewTriggers

    // moveEvent
    $(document).on('click', '.dayView #changeActivityDay', function(event) {
      event.preventDefault();
      let daySelected = $(this).parent('.dayActivity').find('select').val();
      daySelected = daySelected.replace(/\D/g,'');
      daySelected = `.day${daySelected}`;
      const name = $(this).parent('.dayActivity').find('a').text();
      const location = $(this).parent('.dayActivity').find('p').text();
      const url = $(this).parent('.dayActivity').find('a').attr('href');
      let day = $(this).parent('.dayActivity').find('select').val();
      day = day.replace(/\D/g,'');
      const notes = $(this).parent('.dayActivity').find('textarea').text();;
      console.log(name, location, url, day, daySelected, notes);
      if (confirm(`Do you want to move ${name} to Day ${day}`)) {
        // displayDayViewContent(name, location, daySelected, url, notes);
        // postActivity(name, location, day, url);
    } else {
        // Do nothing!
    }

    });

    // deleteEvent
    $(document).on('click', '.dayView .button-delete', function(event) {
      event.preventDefault();
      let day = $(this).parent('.dayActivity').parent('.activities').parent('.dayPage').find('.dayHeader').text();
      day = day = day.replace(/\D/g,'');
      const activityName = $(this).parent('.dayActivity').find('a').text();
      const tripName = store.tripName;
      // console.log('deletedEvent');
      deleteActivity(tripName, activityName, day);
      $(this).parent('.dayActivity').remove();
      activityCount(`.day${day}`);
    })

    $(document).on('click', '.dayView .button-notes', function(event) {
      event.preventDefault();
      let day = $(this).parent('.dayActivity').parent('.activities').parent('.dayPage').find('.dayHeader').text();
      day = day = day.replace(/\D/g,'');
      const activityName = $(this).parent('.dayActivity').find('a').text();
      const notes = $(this).parent('.dayActivity').find('textarea').val().trim();
      const tripName = store.tripName;
      
      updateNotes(day, activityName, notes, tripName);
      alert('Notes saved');
    })




    // packingListTriggers

    $(document).on('click', '.itemList .delete', function(event) {
      event.preventDefault();
      console.log('delete');
      const itemName = $(this).parent('.items').text();
      let category = $(this).parent('.items').parent('.itemList').attr('class');
      category = category.replace('itemList ','');
      // console.log(itemName);
      // console.log(category);
      $(this).parent('.items').remove();
      deletePackingListItem(itemName, category);
    });

    $(document).on('click', '.button-addItem', function(event) {
      event.preventDefault();
      const itemAdded = $(this).parent('.listBox').find('.itemToAdd').val().trim();
      if (itemAdded === '') {
        alert('Item input field cannot be blank');
      }
      else {
        console.log(`${itemAdded} added successfully`);
        const category = $(this).parent('.listBox').parent('.packListContainer').find('.packListHeaders').text();
        // console.log(itemAdded);
        const newItem = `<div class="items"><label><input type="checkbox">${itemAdded}</label><div class="delete"><i class="fa fa-close"></i></div><br></div>`;
        $(this).parent('.listBox').find('.itemList').prepend(newItem);
        $(this).parent('.listBox').find('.itemToAdd').val('');
        postItemToPackingList(itemAdded, category);
      }
    });

    $(document).on('click', '.itemList input', function() {
      console.log('checkItem');
      let checked = $(this).parent('label').parent('.items').find('input');
      if (checked.is(":checked")) {
            console.log(true);
            checked = 'on';
          }
      else {
            console.log(false);
            checked = 'off';
          }

      // console.log(checked);
      const itemName = $(this).parent('label').parent('.items').text();
      let category = $(this).parent('label').parent('.items').parent('.itemList').attr('class');
      category = category.replace('itemList ','');
      // console.log(itemName, category, checked);
      updatePackingListItem(itemName, category, checked);
    })



    // key listeners

    $(document).on('keyup', '.activityContainer #activitySearch-input', function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        $('#activitySearch-button').click();
      }
    });

    $(document).on('keyup', '.tripPlanner .dayContainer', function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
       
        // console.log('dayView');
      let element = $(this).attr('class');
      element = element.replace(/\D/g,'');
      element = `.day${element}`;
      // console.log(element);

      $('.tripPlanner').addClass('hidden');
      $('.dayView').removeClass('hidden');
      $(element).removeClass('hidden');
      $('.links').removeClass('current');
    
      }
    });

    $(document).on('keyup', '.itemList .delete', function(event) {
      event.preventDefault();
      console.log('delete');
      if (event.keyCode === 13) {
        const itemName = $(this).parent('.items').text();
        let category = $(this).parent('.items').parent('.itemList').attr('class');
        category = category.replace('itemList ','');
        // console.log(itemName);
        // console.log(category);
        $(this).parent('.items').remove();
        deletePackingListItem(itemName, category);
      }
    })
  
  }
  
  
  $(function() {
    handleEventListeners();
    });

