'use strict';

let store = {
  username: '',
  tripName: '',
  tripLength: '',
  location: '',
  latitude: '',
  longitude: ''
}


  
  // const serverBase = 'https://travel-planner-capstone.herokuapp.com';
  const serverBase = '';
  
  
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

  let restaurantResults = '<div tabindex=1 class="restaurantResults">';
  restaurantResults += `<p tabindex=1>Name: <span id="restaurantName"><a href="${restaurantURL}" target="_blank" tabindex=1>${restaurantName}</a></span></p>`;
  restaurantResults += `<p tabindex=1>Rating: <span>${rating}/5</span></p>`;
  restaurantResults += `<p tabindex=1>Type: <span>${type}</span></p>`;
  restaurantResults += `<p tabindex=1>Address: <span id="restaurantAddress">${restaurantAddress}</span></p>`;
  restaurantResults += '<select tabindex=1 class="dayDropDown" name="days">';
            
  restaurantResults += '</select>'
  restaurantResults += '<button tabindex=1 id="addToPlanner"type="submit">Add to Planner</button>';
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

  let hikingTrailsResults = '<div tabindex=1 class="hikeResults">';
  hikingTrailsResults += `<p tabindex=1>Name: <span id="trailName"><a href="${trailsURL}" target="_blank" tabindex=1>${trailsName}</a></span></p>`;
  hikingTrailsResults += `<p tabindex=1>Length: <span>${length} miles</span></p>`;
  hikingTrailsResults += `<p tabindex=1>Difficulty: <span>${difficulty}</span></p>`;
  hikingTrailsResults += `<p tabindex=1>Rating: <span>${trailRating}/5</span></p>`;
  hikingTrailsResults += `<p tabindex=1>Location: <span id="trailLocation">${trailLocation}</span></p>`;
  hikingTrailsResults += '<select tabindex=1 class="dayDropDown" name="days">';

  hikingTrailsResults += '</select>';
  hikingTrailsResults += '<button tabindex=1 id="addToPlanner" type="submit">Add to Planner</button>';       
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
    <h3 tabindex=1>${currentDate}</h3>
    <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon}-s.png"/>
    <p tabindex=1>High: <span>${high}</span></p>
    <p tabindex=1>Low: <span>${low}</span></p>
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
        $('#tripList').append(`<li><a href="#">${result.tripName}</a><div title="delete trip" class="deleteTrip"><i class="fa fa-close"></i></div></li>`);
        $('.newTrip').addClass('hidden');
        $('.activitySelection').removeClass('hidden');
        $('.navList-activity').removeClass('hidden');
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
          $('#tripList').append(tripList);
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
      })
      .fail(function(error) {
        // console.log(error);
      })
      $('.profile').addClass('hidden');
      $('.activitySelection').removeClass('hidden');
      $('.navList-activity').removeClass('hidden');
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
            `<div class="items"><label><input tabindex=1 type="checkbox" name="${item.itemName}">${item.itemName}</label> <div tabindex=1 aria-label="select to delete ${item.itemName} from list" class="delete"><i class="fa fa-close"></i></div><br></div>`;
            const itemClass = `.${item.category}`;
            $(itemClass).append(newItem);
            if (item.checked === 'on') {
              // console.log(item.itemName);
              $(`input[name='${item.itemName}']`).prop('checked', true);;
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

      function updatePackingListItem(itemName, category, checked) {
        const username = store.username;
        const tripName = store.tripName;
        const item = itemName.trim();
       
        $.ajax({
              url: serverBase + `/items/${username}/${tripName}/${item }/${category}`,
              method: 'PUT',
              data: `checked=${checked}`,
            })
            .done(function(data) {
              // console.log('success');
            })
      }

  

  function dateDifference() {
    let date1 = $('#from').val();
    date1 = '\"' + date1 + '\"';
    date1 = new Date(date1);
    let date2 = $('#to').val();
    date2 = '\"' + date2 + '\"';
    date2 = new Date(date2);
    var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)); 
    // console.log(diffDays);
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
            <h3 tabindex=1 >Day ${i}</h3>
            <p tabindex=1 >0 activities saved</p>
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
      dayView += `<div class="dayPage day${i} hidden"><h1 tabindex=1 class="dayHeader">${name} (Day ${i})</h1>
      <div class="activities">

      </div>
      </div>`
    }
    $('.dayView').html(dayView);
  }

  function displayDayViewContent(name, address, daySelected, url, notes) {
    let dayViewContent = '';
    if (url === undefined) {
      dayViewContent = `<div class="dayActivity">
      <h2 tabindex=1>${name}</h2>
      <p tabindex=1>${address}</p><br>
      <button tabindex=1 class="button-delete" type="button">Delete</button>
      <textarea tabindex=1 rows="4" cols="50" class="notesInput">${notes} 
      </textarea>
      <button tabindex=1 class="button-notes" type="button">Save Notes</button>
      </div>`
    }
    else {
      dayViewContent = `<div class="dayActivity">
      <h2><a href="${url}" target="_blank" tabindex=1>${name}</a></h2>
      <p tabindex=1>${address}</p><br>
      <button tabindex=1 class="button-delete" type="button">Delete</button>
      <textarea tabindex=1 rows="4" cols="50" class="notesInput">${notes} 
      </textarea>
      <button tabindex=1 class="button-notes" type="button">Save Notes</button>
      </div>`
    }

    $(`${daySelected}`).find('.activities').append(dayViewContent);
    activityCount(daySelected);
  }

  // activityCount
  function activityCount(daySelected) {
    // console.log(`count for ${daySelected}`);
    const itemCount = $(`${daySelected}`).find('.activities').children().length;
    // console.log(itemCount);
    const day = daySelected.replace(/\D/g,'');

    const activityCount = `<p>${itemCount} activities saved</p>`;
    // console.log(activityCount);
    $(`.plannerDay${day}`).find('p').html(activityCount);
    
  }
  
  
  function handleEventListeners() {

    // landing listeners

    $('#signUp-button').click(function() {
      // console.log('signUp');
      $('.landing').addClass('hidden');
      $('.signUp').removeClass('hidden');
    });

    $('#logIn-button').click(function() {
      // console.log('logIn');
      $('.landing').addClass('hidden');
      $('.logIn').removeClass('hidden');
    });

    // signUp listeners

    $('#cancel').click(function() {
      // console.log('signUp');
      $('.signUp').addClass('hidden');
      $('.landing').removeClass('hidden');
    });

    $('#toLogIn').click(function() {
      // console.log('signUp');
      $('.signUp').addClass('hidden');
      $('.logIn').removeClass('hidden');
    });

    // logIn listeners

    $('#cancelLogIn').click(function() {
      // console.log('signUp');
      $('.logIn').addClass('hidden');
      $('.landing').removeClass('hidden');
    });

    $('#toSignUp').click(function() {
      // console.log('signUp');
      $('.logIn').addClass('hidden');
      $('.signUp').removeClass('hidden');
    });

    // profile listeners

    $('#newTrip').click(function() {
      // console.log('newTripForm');
      $('.profile').addClass('hidden');
      $('.newTrip').removeClass('hidden');
    });

    $('#tripList').on('click', 'a', function(e) {
      e.preventDefault();
      const name = $(this).text();
      // console.log(name);
      getTrip(name);
    })

    $('#tripList').on('click', '.deleteTrip', function(event) {
      // console.log('delete');
      const tripName = $(this).parent('li').find('a').html();
      
      console.log(tripName);
      $(this).parent('li').remove();
      deleteTrip(tripName);
    });

    // newTrip listeners 

    $('#createTrip').click(function(e) {
      e.preventDefault();
      const name = $('#tripName').val();
      const city = $('#tripLocation').val();
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
    });

    $('#cancelTrip').click(function() {
      // console.log('signUp');
      $('.newTrip').addClass('hidden');
      $('.profile').removeClass('hidden');
    });

    // activitySelection listeners

    $('#viewPlanner').click(function() {
      // console.log('viewTravelPlanner');
      $('.activitySelection').addClass('hidden');
      $('.tripPlanner').removeClass('hidden');
      $('.navList-activity').addClass('hidden');
      $('.navList-planner').removeClass('hidden');
    });

    $('#createPackList').click(function() {
      // console.log('createPackingList');
      $('.activitySelection').addClass('hidden');
      $('.packingList').removeClass('hidden');
      $('.navList-activity').addClass('hidden');
      $('.navList-packing').removeClass('hidden');
    });

    // tripPlanner listeners

    $('.tripPlanner').on('click', '.dayContainer', function() {
      // console.log('dayView');
      let element = $(this).attr('class');
      element = element.replace(/\D/g,'');
      element = `.day${element}`;
      // console.log(element);
      
      
      $('.tripPlanner').addClass('hidden');
      $('.dayView').removeClass('hidden');
      $(element).removeClass('hidden');
      $('.navList-planner').addClass('hidden');
      $('.navList-day').removeClass('hidden');
    });

    // nav listeners

// activity Nav
    $('#profileNav-activity').click(function() {
      // console.log('toProfile');
      $('.activitySelection').addClass('hidden');
      $('.navList-activity').addClass('hidden');
      $('.profile').removeClass('hidden');
      $('.itemList').empty();
      $('.activityResultsContainer').empty();
      $('.restaurantContainer').empty();
      $('.hikeContainer').empty();
    });

    $('#plannerNav-activity').click(function() {
      // console.log('toPlanner');
      $('.activitySelection').addClass('hidden');
      $('.navList-activity').addClass('hidden');
      $('.tripPlanner').removeClass('hidden');
      $('.navList-planner').removeClass('hidden');
    });

    $('#packingNav-activity').click(function() {
      // console.log('toPacking');
      $('.activitySelection').addClass('hidden');
      $('.navList-activity').addClass('hidden');
      $('.packingList').removeClass('hidden');
      $('.navList-packing').removeClass('hidden');
    });

    // planner Nav

    $('#profileNav-planner').click(function() {
      // console.log('toProfile');
      $('.tripPlanner').addClass('hidden');
      $('.navList-planner').addClass('hidden');
      $('.profile').removeClass('hidden');
      $('.itemList').empty();
      $('.activityResultsContainer').empty();
      $('.restaurantContainer').empty();
      $('.hikeContainer').empty();
    });

    $('#activityNav-planner').click(function() {
      // console.log('toActivity');
      $('.tripPlanner').addClass('hidden');
      $('.navList-planner').addClass('hidden');
      $('.activitySelection').removeClass('hidden');
      $('.navList-activity').removeClass('hidden');
    });

    $('#packingNav-planner').click(function() {
      // console.log('toPacking');
      $('.tripPlanner').addClass('hidden');
      $('.navList-planner').addClass('hidden');
      $('.packingList').removeClass('hidden');
      $('.navList-packing').removeClass('hidden');
    });

    // day Nav

    $('#profileNav-day').click(function() {
      // console.log('toProfile');
      $('.dayView').addClass('hidden');
      $('.navList-day').addClass('hidden');
      $('.profile').removeClass('hidden');
      const days = store.tripLength;
      for (let i = 1; i <= days; i++) {
        $(`.day${i}`).addClass('hidden');
        $('.itemList').empty();
        $('.activityResultsContainer').empty();
        $('.restaurantContainer').empty();
        $('.hikeContainer').empty();
      }
    });

    $('#activityNav-day').click(function() {
      // console.log('toActivity');
      $('.dayView').addClass('hidden');
      $('.navList-day').addClass('hidden');
      $('.activitySelection').removeClass('hidden');
      $('.navList-activity').removeClass('hidden');
      const days = store.tripLength;
      for (let i = 1; i <= days; i++) {
        $(`.day${i}`).addClass('hidden');
      }
    });

    $('#packingNav-day').click(function() {
      // console.log('toPacking');
      $('.dayView').addClass('hidden');
      $('.navList-day').addClass('hidden');
      $('.packingList').removeClass('hidden');
      $('.navList-packing').removeClass('hidden');
      const days = store.tripLength;
      for (let i = 1; i <= days; i++) {
        $(`.day${i}`).addClass('hidden');
      }
    });

    $('#plannerNav-day').click(function() {
      // console.log('toPacking');
      $('.dayView').addClass('hidden');
      $('.navList-day').addClass('hidden');
      $('.tripPlanner').removeClass('hidden');
      $('.navList-planner').removeClass('hidden');
      const days = store.tripLength;
      for (let i = 1; i <= days; i++) {
        $(`.day${i}`).addClass('hidden');
      }
    });

    // packing Nav

    $('#profileNav-packing').click(function() {
      // console.log('toProfile');
      $('.packingList').addClass('hidden');
      $('.navList-packing').addClass('hidden');
      $('.profile').removeClass('hidden');
      $('.itemList').empty();
      $('.activityResultsContainer').empty();
      $('.restaurantContainer').empty();
      $('.hikeContainer').empty();
    });

    $('#activityNav-packing').click(function() {
      // console.log('toActivity');
      $('.packingList').addClass('hidden');
      $('.navList-packing').addClass('hidden');
      $('.activitySelection').removeClass('hidden');
      $('.navList-activity').removeClass('hidden');
    });

    $('#plannerNav-packing').click(function() {
      // console.log('toPacking');
      $('.packingList').addClass('hidden');
      $('.navList-packing').addClass('hidden');
      $('.tripPlanner').removeClass('hidden');
      $('.navList-planner').removeClass('hidden');
    });

    // activitySearchTriggers
    $('.activityContainer').on('click', '#activitySearch-button', function(e) {
      e.preventDefault();
      const keyword = $('#activitySearch-input').val();
      const lat = +localStorage.getItem('lat');
      // const lat = +store.latitude;
      const lon = +localStorage.getItem('lon');
      // const lon = +store.longitude;
      // console.log(typeof +lat ,typeof +lon);

      $('.activityResultsContainer').html('');
      initSearch(lat, lon, keyword);
      $('#activitySearch-input').val('');
    })

    // restaurants
    $('.restaurantContainer').on('click', '#addToPlanner', function(e) {
      e.preventDefault();
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

    $('.activityResultsContainer').on('click', '#addToPlanner', function(e) {
      e.preventDefault();
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

    $('.hikeContainer').on('click', '#addToPlanner', function(e) {
      e.preventDefault();
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

    // deleteEvent
    $('.dayView').on('click', '.button-delete', function(e) {
      e.preventDefault();
      let day = $(this).parent('.dayActivity').parent('.activities').parent('.dayPage').find('.dayHeader').text();
      day = day = day.replace(/\D/g,'');
      const activityName = $(this).parent('.dayActivity').find('a').text();
      const tripName = store.tripName;
      // console.log('deletedEvent');
      deleteActivity(tripName, activityName, day);
      $(this).parent('.dayActivity').remove();
      activityCount(`.day${day}`);
    })

    $('.dayView').on('click', '.button-notes', function(e) {
      e.preventDefault();
      let day = $(this).parent('.dayActivity').parent('.activities').parent('.dayPage').find('.dayHeader').text();
      day = day = day.replace(/\D/g,'');
      const activityName = $(this).parent('.dayActivity').find('a').text();
      const notes = $(this).parent('.dayActivity').find('textarea').val();
      const tripName = store.tripName;
      
      updateNotes(day, activityName, notes, tripName);
    })




    // packingListTriggers

    $('.itemList').on('click', '.delete', function(event) {
      // console.log('delete');
      const itemName = $(this).parent('.items').text();
      let category = $(this).parent('.items').parent('.itemList').attr('class');
      category = category.replace('itemList ','');
      // console.log(itemName);
      // console.log(category);
      $(this).parent('.items').remove();
      deletePackingListItem(itemName, category);
    });

    $('.button-addItem').click(function() {
      const itemAdded = $(this).parent('.listBox').find('.itemToAdd').val();
      if (itemAdded === '') {
        alert('Item input field cannot be blank');
      }
      else {
        alert(`${itemAdded} added successfully`);
        const category = $(this).parent('.listBox').parent('.packListContainer').find('.packListHeaders').text();
        // console.log(itemAdded);
        const newItem = `<div class="items"><label><input type="checkbox">${itemAdded}</label> <div class="delete"><i class="fa fa-close"></i></div><br></div>`;
        $(this).parent('.listBox').find('.itemList').prepend(newItem);
        $(this).parent('.listBox').find('.itemToAdd').val('');
        postItemToPackingList(itemAdded, category);
      }
    });

    $('.itemList').on('click', 'input', function() {
      let checked = $(this).parent('label').parent('.items').find('input');
      if (checked.is(":checked")) {
            // console.log(true);
            checked = 'on';
          }
      else {
            // console.log(false);
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

    $('.activityContainer').on('keyup', '#activitySearch-input', function(event) {
      if (event.keyCode === 13) {
        $('#activitySearch-button').click();
      }
    });

    $('.tripPlanner').on('keyup', '.dayContainer', function(event) {
      if (event.keyCode === 13) {
       
        // console.log('dayView');
      let element = $(this).attr('class');
      element = element.replace(/\D/g,'');
      element = `.day${element}`;
      // console.log(element);

      $('.tripPlanner').addClass('hidden');
      $('.dayView').removeClass('hidden');
      $(element).removeClass('hidden');
      $('.navList-planner').addClass('hidden');
      $('.navList-day').removeClass('hidden');
    
      }
    });

    $('.itemList').on('keyup', '.delete', function() {
      // console.log('delete');
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
    $(".fadeOutHeader").fadeOut(15000);
    });

