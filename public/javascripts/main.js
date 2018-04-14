'use strict';
  
  // const serverBase = 'https://travel-planner-capstone.herokuapp.com';
  const serverBase = '';

  
  // API Calls
function getWeatherForecast(city, countryCode, callback){
    $.getJSON(`api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=3e012f872736c45d1c4ad8ca39091bbf&callback=?`)
    .done(callback)
    .fail(function(err){
        console.log(err)
    });
}

function getCityId(city, callback){
    $.getJSON(`https://developers.zomato.com/api/v2.1/locations?query=${city}&user-key: 3487285e21b6370abf8d29bfc2bb0a29&callback=?`)
    .done(callback)
    .fail(function(err){
        console.log(err)
    });
}

function getRestaurants(cityId, callback){
    $.getJSON(`https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&user-key: 3487285e21b6370abf8d29bfc2bb0a29&entity_type=city&count=50&sort=rating&order=desc&callback=?`)
    .done(callback)
    .fail(function(err){
        console.log(err)
    });

function getHikingTrails(lat, lon, callback){
    $.getJSON(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=50&sort=quality&key=200240688-9f702ff0e042839c3e70ab4f893b733f&callback=?`)
    .done(callback)
    .fail(function(err){
        console.log(err)
    });
}

// Render and Display API results

function displayRestaurantResults(data) {
  const restaurantResults = data.restaurants.map((restaurants, index) => renderRestaurantResults(restaurants,index));
  $(".restaurantContainer").html(restaurantResults);
}

function renderRestaurantResults(restaurants, index) {
  const restaurantName = restaurants.name;
  const restaurantAddress = restaurants.location.address;
  const restaurantURL = restaurants.url;
  const type = restaurants.cuisines;
  const rating = restaurants.user_rating.aggregate_rating;

  const restaurantResults = 
  `<div class="restaurantResults">
    <p>Name: <a href="${restaurantURL}">${restaurantName}</a></p>
    <p>Rating: <span>${rating}/5</span></p>
    <p>Type: <span>${type}</span></p>
    <p>Address: <span>${restaurantAddress}</span></p>
    <select class="dayDropDown" name="days">
            <option value="day1">Day 1</option>
            <option value="day2">Day 2</option>
            <option value="day3">Day 3</option>
            <option value="day4">Day 4</option>
            <option value="day5">Day 5</option>
            <option value="day6">Day 6</option>
            <option value="day7">Day 7</option>
            <option value="day8">Day 8</option>
    </select>
    <button type="button">Add to Planner</button>
</div>`;
return restaurantResults;
}

function displayHikingTrailsResults(data) {
  console.log(data);
  const hikingTrailsResults = data.trails.map((trails, index) => renderHikingTrailsResults(trails,index));
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
          <option value="day1">Day 1</option>
          <option value="day2">Day 2</option>
          <option value="day3">Day 3</option>
          <option value="day4">Day 4</option>
          <option value="day5">Day 5</option>
          <option value="day6">Day 6</option>
          <option value="day7">Day 7</option>
          <option value="day8">Day 8</option>
  </select>
  <button type="button">Add to Planner</button>
</div>`;
return hikingTrailsResults;
}

function displayWeatherResults(data) {
  console.log(data);
  const weatherResults = data.list.map((list, index) => renderWeatherResults(list,index));
  $(".weatherBar").html(weatherResults);
}

function renderWeatherResults(list, index) {
  const low = list.main.temp_min;
  const high = list.main.temp_max;
  const weatherIcon = list.weather.icon;
  const todaysDate = today.getDate();

  const weatherResults = 
  `<div class="weatherContainer">
  <h3>Day 1</h3>
  <p>${weatherIcon}</p>
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
    return diffDays;
  }
  
  function displayTripLength(tripLength, tripTitle) {
    const headerText = `${tripTitle} (${tripLength} days)`;
    $('.viewHeader').html(headerText);
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

    $('#createTrip').click(function() {
      const tripName = $('#tripName').val();
      displayTripLength(dateDifference(), tripName);
      console.log('tripCreated');
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