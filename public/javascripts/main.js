'use strict';
  
  // const serverBase = 'https://travel-planner-capstone.herokuapp.com';
  const serverBase = '';
  
  const username = {};

  
  // API Calls
function getWeatherForecast(lat, lon){
  console.log('hello');
    $.getJSON(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=3e012f872736c45d1c4ad8ca39091bbf&units=imperial&callback=?`)
    // .done(callback)
    .done(function(result) {
      console.log(result);
      displayWeatherResults(result);
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

function getRestaurants(lat, lon){
  $.ajax({
    url: `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lon}&sort=rating&order=desc`,
    type: 'GET',
    dataType: 'json',
    headers: {
      'user-key': '3487285e21b6370abf8d29bfc2bb0a29'
  }
  })
    .done(function(result) {
      console.log(result);
      displayRestaurantResults(result);
    })
    .fail(function(err){
        console.log(err)
    });
}

function getHikingTrails(lat, lon){
    $.getJSON(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=50&sort=quality&key=200240688-9f702ff0e042839c3e70ab4f893b733f&callback=?`)
    .done(function(result) {
      console.log(result);
      displayHikingTrailsResults(result);
    })
    .fail(function(err){
        console.log(err)
    });
}

// Render and Display API results

function renderLatLon(data) {
  const lat = data.location_suggestions[0].latitude;
  const lon = data.location_suggestions[0].longitude;
  console.log(lat, lon);
  getWeatherForecast(lat, lon);
  getRestaurants(lat, lon);
  getHikingTrails(lat, lon);

}

function displayRestaurantResults(data) {
  const restaurantResults = data.restaurants.map((items, index) => renderRestaurantResults(items,index));
  $(".restaurantContainer").html(restaurantResults);
}

function renderRestaurantResults(items, index) {
  const restaurantName = items.restaurant.name;
  const restaurantAddress = items.restaurant.location.address;
  const restaurantURL = items.restaurant.url;
  const type = items.restaurant.cuisines;
  const rating = items.restaurant.user_rating.aggregate_rating;

  const restaurantResults = 
  `<div class="restaurantResults">
    <p>Name: <a href="${restaurantURL}">${restaurantName}</a></p>
    <p>Rating: <span>${rating}/5</span></p>
    <p>Type: <span>${type}</span></p>
    <p>Address: <span>${restaurantAddress}</span></p>
    <select class="dayDropDown" name="days">
            
    </select>
    <button type="button">Add to Planner</button>
</div>`;
return restaurantResults;
}

function displayHikingTrailsResults(data) {
  const hikingTrailsResults = data.map((trails, index) => renderHikingTrailsResults(trails,index));
  $(".hikeContainer").html(hikingTrailsResults);
}

function renderHikingTrailsResults(trails, index) {
  const trailsName = trails.name;
  const trailsURL = trails.url;
  const length = trails.length;
  const trailRating = trails.stars;
  let difficulty = trails.difficulty;

  console.log(difficulty);

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

  const hikingTrailsResults = 
  `<div class="hikeResults">
  <p>Name: <a href="${trailsURL}">${trailsName}</a></p>
  <p>Length: <span>${length}</span></p>
  <p>Difficulty: <span>${difficulty}</span></p>
  <p>Rating: <span>${trailRating}</span></p>
  <select class="dayDropDown" name="days">
          
  </select>
  <button type="button">Add to Planner</button>
</div>`;
return hikingTrailsResults;
}

function displayWeatherResults(data) {
  const weatherResults = data.list.map((item, index) => renderWeatherResults(item,index));
  $(".weatherBar").html(weatherResults);
}

function renderWeatherResults(item, index) {
  const low = item.main.temp_min;
  const high = item.main.temp_max;
  const weatherIcon = item.weather[0].icon;
  // const timeConversion = new Date(item.dt * 1000);
  // const date = timeConversion.getDate();
  // console.log(date);

  const weatherResults = 
  `<div class="weatherContainer">
  <h3>Day 1</h3>
  <img src='http://openweathermap.org/img/w/${weatherIcon}.png'/>
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
    displayDayDropDown(diffDays);
    return diffDays;
  }

  // Displays headers on each view
  function displayTripHeaders(tripLength, tripTitle) {
    const headerText = `${tripTitle} (${tripLength} days)`;
    $('.viewHeader').html(headerText);
  }

  // Displays day drop down in search containers
  function displayDayDropDown(days) {
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
      const tripName = $('#tripName').val();
      const city = $('#tripLocation').val();
      console.log(city, tripName);
      getLatLon(city);
      // (displayTripHeaders(dateDifference(), tripName));
      console.log('tripCreated');
      $('#tripName').val('');
      $('#tripLocation').val('');

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