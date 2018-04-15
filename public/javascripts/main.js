'use strict';
  
  // const serverBase = 'https://travel-planner-capstone.herokuapp.com';
  const serverBase = '';
  
  let username = '';
  
  // API Calls
function getWeatherForecast(locationKey){
    $.getJSON(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=VFDAkPsWGspNGI0hnUmmssJqqUxWZgJn`)
    // .done(callback)
    .done(function(result) {
      console.log(result);
      displayWeatherResults(result);
    })
    .fail(function(err){
        console.log(err)
    });
}

function getLocationKey(city) {
  $.getJSON(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=VFDAkPsWGspNGI0hnUmmssJqqUxWZgJn&q=${city}`)
  // .done(callback)
  .done(function(result) {
    renderLocationKey(result);
  })
  .fail(function(err){
      console.log(err)
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
        console.log(err)
    });
}

function getPlaces(lat, lon, searchInput){
  $.getJSON(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=50000&keyword=${searchInput}&rankBy=prominence&key= AIzaSyB8wYopFhHNaCNt9f9lko97Da9hX8z3vZU`)
  .done(function(result) {
    console.log(result);
    displayPlaces(result);
  })
  .fail(function(err){
      console.log(err)
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
    })
    .fail(function(err){
        console.log(err)
    });
}

function getHikingTrails(lat, lon){
  $.ajax({
    url: `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=50&maxResults=40&sort=quality&key=200240688-9f702ff0e042839c3e70ab4f893b733f`,
    type: 'GET',
    dataType: 'json',
  })
    .done(function(result) {
      console.log(result);
      displayHikingTrailsResults(result);
    })
    .fail(function(err){
        console.log(err)
    });
}

// Render and Display API results

function renderLocationKey (data) {
  const locationKey = data[0].Key;
  console.log(locationKey);
  getWeatherForecast(locationKey);
}

function renderLatLon(data) {
  const lat = data.location_suggestions[0].latitude;
  const lon = data.location_suggestions[0].longitude;
  localStorage.setItem("lat", lat);
  localStorage.setItem("lon", lon);
  getRestaurants(lat, lon, 0);
  getRestaurants(lat, lon, 20);
  getRestaurants(lat, lon, 40);
  getPlaces(lat, lon, 'things to do');
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
  restaurantResults += `<p>Name: <a href="${restaurantURL}" target="_blank">${restaurantName}</a></p>`;
  restaurantResults += `<p>Rating: <span>${rating}/5</span></p>`;
  restaurantResults += `<p>Type: <span>${type}</span></p>`;
  restaurantResults += `<p>Address: <span>${restaurantAddress}</span></p>`;
  restaurantResults += '<select class="dayDropDown" name="days">';
            
  restaurantResults += '</select>'
  restaurantResults += '<button type="button">Add to Planner</button>'
  restaurantResults += '</div>';
return restaurantResults;
}

function displayPlaces(data) {
  
  const Places = data.results.map((result, index) => renderPlaces(result,index));
  $(".activityResultsContainer").append(Places);
}

function renderPlaces(result, index) {
  const placeName = result.name;
  const placeAddress = result.vicinity;
  const type = result.types[0];
  const rating = result.rating;

  let Places = '<div class="activityResults">';
  Places += `<p>Name: ${placeName}</p>`;
  Places += `<p>Rating: <span>${rating}/5</span></p>`;
  Places += `<p>Type: <span>${type}</span></p>`;
  Places += `<p>Address: <span>${placeAddress}</span></p>`;
  Places += '<select class="dayDropDown" name="days">';
            
  Places += '</select>'
  Places += '<button type="button">Add to Planner</button>'
  Places += '</div>';
return Places;
}

function displayHikingTrailsResults(data) {
  const hikingTrailsResults = data.trails.map((trail, index) => renderHikingTrailsResults(trail,index));
  $(".hikeContainer").html(hikingTrailsResults);
}

function renderHikingTrailsResults(trail, index) {
  const trailsName = trail.name;
  const trailsURL = trail.url;
  const length = trail.length;
  const trailRating = trail.stars;
  let difficulty = trail.difficulty;

  // console.log(difficulty);

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
  hikingTrailsResults += `<p>Name: <a href="${trailsURL}" target="_blank">${trailsName}</a></p>`;
  hikingTrailsResults += `<p>Length: <span>${length} miles</span></p>`;
  hikingTrailsResults += `<p>Difficulty: <span>${difficulty}</span></p>`;
  hikingTrailsResults += `<p>Rating: <span>${trailRating}/5</span></p>`;
  hikingTrailsResults += '<select class="dayDropDown" name="days">';
          
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


  // function updateMeme(id) {
  //   console.log('Updating meme `' + id + '`');
  //   $.ajax({
  //     url: memeCreation_URL + '/' + id,
  //     method: 'PUT',
  //     success: function(data) {
  //       console.log('success');
  //     }
  //   });
  // }
  
  // function deletePhoto(photoId) {
  //   console.log('Deleting recipe `' + photoId + '`');
  //   $.ajax({
  //     url: photoSelectionURL + '/' + photoId,
  //     method: 'DELETE',
  //     success: getAndDisplayRecipes
  //   });
  // }

// datepicker

  function datePickerCalendar() {
    var dateFormat = "mm/dd/yy",
      from = $( "#from" )
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
        }),
      to = $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1
      })
      .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
      });
 
    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
      }
 
      return date;
    }
  };

  function dateDifference() {
    let date1 = $('#from').val();
    date1 = '\"' + date1 + '\"';
    date1 = new Date(date1);
    let date2 = $('#to').val();
    date2 = '\"' + date2 + '\"';
    date2 = new Date(date2);
    var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)); 
    console.log(diffDays);
    localStorage.setItem("tripLength", diffDays);
    
  }

  // Displays headers on each view
  function displayTripHeaders() {
    const name = localStorage.getItem("tripName");
    const length = localStorage.getItem("tripLength");
    console.log(name, length);
    const headerText = `${name} (${length} days)`;
    $('.viewHeader').html(headerText);
  }

  // Displays day drop down in search containers
  function displayDayDropDown() {
    console.log('dropDownDisplay');
    const days = localStorage.getItem("tripLength");
    console.log(days);
    for (let i = 1; i = days; i++) {
      const dropDown = `<option value="day${i}">Day ${i}</option>`
      $('.dayDropDown').append(dropDown);
    }
  }
  
  function handleEventListeners() {

    // landing listeners

    $('#signUp-button').click(function() {
      console.log('signUp');
      $('.landing').addClass('hidden');
      $('.signUp').removeClass('hidden');
    });

    $('#logIn-button').click(function() {
      console.log('logIn');
      $('.landing').addClass('hidden');
      $('.logIn').removeClass('hidden');
    });

    // signUp listeners

    $('#cancel').click(function() {
      console.log('signUp');
      $('.signUp').addClass('hidden');
      $('.landing').removeClass('hidden');
    });

    $('#toLogIn').click(function() {
      console.log('signUp');
      $('.signUp').addClass('hidden');
      $('.logIn').removeClass('hidden');
    });

    // logIn listeners

    $('#cancelLogIn').click(function() {
      console.log('signUp');
      $('.logIn').addClass('hidden');
      $('.landing').removeClass('hidden');
    });

    $('#toSignUp').click(function() {
      console.log('signUp');
      $('.logIn').addClass('hidden');
      $('.signUp').removeClass('hidden');
    });

    // profile listeners

    $('#newTrip').click(function() {
      console.log('newTripForm');
      $('.profile').addClass('hidden');
      $('.newTrip').removeClass('hidden');
    });

    // newTrip listeners 

    $('#createTrip').click(function(e) {
      e.preventDefault();
      const name = $('#tripName').val();
      const city = $('#tripLocation').val();

      localStorage.setItem("tripName", name);
      getLatLon(city);
      getLocationKey(city);
      dateDifference();
      displayTripHeaders();
      
      console.log('tripCreated');
      $('#tripName').val('');
      $('#tripLocation').val('');
      $('#from').val('');
      $('to').val('');

      $('.newTrip').addClass('hidden');
      $('.activitySelection').removeClass('hidden');
      $('.navList-activity').removeClass('hidden');
    });

    $('#cancelTrip').click(function() {
      console.log('signUp');
      $('.newTrip').addClass('hidden');
      $('.profile').removeClass('hidden');
    });

    // activitySelection listeners

    $('#viewPlanner').click(function() {
      console.log('viewTravelPlanner');
      $('.activitySelection').addClass('hidden');
      $('.tripPlanner').removeClass('hidden');
      $('.navList-activity').addClass('hidden');
      $('.navList-planner').removeClass('hidden');
    });

    $('#createPackList').click(function() {
      console.log('createPackingList');
      $('.activitySelection').addClass('hidden');
      $('.packingList').removeClass('hidden');
      $('.navList-activity').addClass('hidden');
      $('.navList-packing').removeClass('hidden');
    });

    // tripPlanner listeners

    $('.dayContainer').click(function() {
      console.log('dayView');
      $('.tripPlanner').addClass('hidden');
      $('.dayView').removeClass('hidden');
      $('.navList-planner').addClass('hidden');
      $('.navList-day').removeClass('hidden');
    });

    // dayView listeners

    $('.button-delete').click(function() {
      console.log('deleteActivity');
    });

    $('.button-notes').click(function() {
      console.log('saveNotes');
    });

    // packingList listeners

    $('.button-addItem').click(function() {
      console.log('addItem');
    });

    // nav listeners

// activity Nav
    $('#profileNav-activity').click(function() {
      console.log('toProfile');
      $('.activitySelection').addClass('hidden');
      $('.navList-activity').addClass('hidden');
      $('.profile').removeClass('hidden');
    });

    $('#plannerNav-activity').click(function() {
      console.log('toPlanner');
      $('.activitySelection').addClass('hidden');
      $('.navList-activity').addClass('hidden');
      $('.tripPlanner').removeClass('hidden');
      $('.navList-planner').removeClass('hidden');
    });

    $('#packingNav-activity').click(function() {
      console.log('toPacking');
      $('.activitySelection').addClass('hidden');
      $('.navList-activity').addClass('hidden');
      $('.packingList').removeClass('hidden');
      $('.navList-packing').removeClass('hidden');
    });

    // planner Nav

    $('#profileNav-planner').click(function() {
      console.log('toProfile');
      $('.tripPlanner').addClass('hidden');
      $('.navList-planner').addClass('hidden');
      $('.profile').removeClass('hidden');
    });

    $('#activityNav-planner').click(function() {
      console.log('toActivity');
      $('.tripPlanner').addClass('hidden');
      $('.navList-planner').addClass('hidden');
      $('.activitySelection').removeClass('hidden');
      $('.navList-activity').removeClass('hidden');
    });

    $('#packingNav-planner').click(function() {
      console.log('toPacking');
      $('.tripPlanner').addClass('hidden');
      $('.navList-planner').addClass('hidden');
      $('.packingList').removeClass('hidden');
      $('.navList-packing').removeClass('hidden');
    });

    // day Nav

    $('#profileNav-day').click(function() {
      console.log('toProfile');
      $('.dayView').addClass('hidden');
      $('.navList-day').addClass('hidden');
      $('.profile').removeClass('hidden');
    });

    $('#activityNav-day').click(function() {
      console.log('toActivity');
      $('.dayView').addClass('hidden');
      $('.navList-day').addClass('hidden');
      $('.activitySelection').removeClass('hidden');
      $('.navList-activity').removeClass('hidden');
    });

    $('#packingNav-day').click(function() {
      console.log('toPacking');
      $('.dayView').addClass('hidden');
      $('.navList-day').addClass('hidden');
      $('.packingList').removeClass('hidden');
      $('.navList-packing').removeClass('hidden');
    });

    $('#plannerNav-day').click(function() {
      console.log('toPacking');
      $('.dayView').addClass('hidden');
      $('.navList-day').addClass('hidden');
      $('.tripPlanner').removeClass('hidden');
      $('.navList-planner').removeClass('hidden');
    });

    // packing Nav

    $('#profileNav-packing').click(function() {
      console.log('toProfile');
      $('.packingList').addClass('hidden');
      $('.navList-packing').addClass('hidden');
      $('.profile').removeClass('hidden');
    });

    $('#activityNav-packing').click(function() {
      console.log('toActivity');
      $('.packingList').addClass('hidden');
      $('.navList-packing').addClass('hidden');
      $('.activitySelection').removeClass('hidden');
      $('.navList-activity').removeClass('hidden');
    });

    $('#plannerNav-packing').click(function() {
      console.log('toPacking');
      $('.packingList').addClass('hidden');
      $('.navList-packing').addClass('hidden');
      $('.tripPlanner').removeClass('hidden');
      $('.navList-planner').removeClass('hidden');
    });

    // activitySearch
    $('.activityContainer').on('click', '#activitySearch-button', function(e) {
      e.preventDefault();
      const searchTerm = $('#activitySearch-input').val();
      console.log(searchTerm);
      const lat = localStorage.getItem('lat');
      const lon = localStorage.getItem('lon');
      $('.activityResultsContainer').html('');
      getPlaces(lat, lon, searchTerm);
    })

    // packingListTriggers

    $('.itemList').on('click', '.delete', function(event) {
      console.log('delete');
      $(this).parent('.items').remove();
    });

    $('.button-addItem').click(function() {
      const itemAdded = $(this).parent('.listBox').find('.itemToAdd').val();
      console.log(itemAdded);
      const newItem = `<div class="items"><label><input type="checkbox">${itemAdded}</label> <div class="delete"><i class="fa fa-close"></i></div><br></div>`;
      $(this).parent('.listBox').find('.itemList').append(newItem);
    });

    // key listeners

  //   $('.memeBanner').on('keyup', '.clickableIcon', function(event) {
  //     if (event.keyCode === 13) {
  //       $(this).click();
  //     }
  //   });
  
  }
  
  
  $(function() {
    handleEventListeners();
    $(".fadeOutHeader").fadeOut(15000);
    datePickerCalendar();
    });