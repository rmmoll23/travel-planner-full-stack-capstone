'use strict';
  
  const serverBase = 'https://meme-generator-capstone.herokuapp.com/';
  // const serverBase = '//localhost:8080/';
  const photoSelection_URL = serverBase + 'photos';
  const memeCreation_URL = serverBase + 'memes';
  
  
  function getAndDisplayMemeFeed_top() {
    // $('body').loader('show');
    console.log('Retrieving top memes')
    const memeTop_URL = memeCreation_URL + '/top';
    $.getJSON(memeTop_URL, function(memes) {
      const memeFeedTop = memes.map(function(meme) {
        const memeFeedTopTemplate = 
          `<div class='parent'>
            <img class='mySlides' id='${meme._id}' src='${meme.memeURL}'>
            <span tabIndex=2 aria-label='Click if you like this meme' class='clickableMemeIcon' id='${meme._id}'><i class='far fa-star'></i><span class='likeCount'>${meme.liked}</span></span>
            <button tabIndex=1 aria-label='Click to move left through the meme feed' class='navButtons' id='displayLeft' onclick='plusDivs(-1)'>&#10094;</button>
            <button tabIndex=1 aria-label='Click to move right through the meme feed' class='navButtons' id='displayRight' onclick='plusDivs(1)'>&#10095;</button>
           </div>`;
        return memeFeedTopTemplate;
      })
      $('.memeBanner').empty();
      $('.memeBanner').append(memeFeedTop);
      slideIndex = 1;
      showDivs(1);
      // $('body').loader('hide');
    });
  }
  
  function addPhoto(photo) {
    console.log(photo);
    $.ajax({
      method: 'POST',
      url: photoSelection_URL,
      data: JSON.stringify(photo),
      dataType: 'json',
      contentType: 'application/json'
    });
  }

  function updatePhoto(id) {
    console.log('Updating photo `' + id + '`');
    $.ajax({
      url: photoSelection_URL + '/' + id,
      method: 'PUT',
      success: function(data) {
        console.log('success');
      }
    });
  }
  
  function addMeme(meme) {
    const memePath = {memeURL: meme,
      liked: 0}
    console.log('Adding meme'); 
    $.ajax({
      method: 'POST',
      url: memeCreation_URL,
      data: JSON.stringify(memePath),
      dataType: 'json',
      contentType: 'application/json',
      success: function () {
        console.log('success');
        alert('Meme submitted successfully!'); 
        setTimeout(getAndDisplayMemeFeed_recent(), 5000);
      },
      error: function (error) {
        console.log(error);
      }
    });
    $('.photoBanner').empty();
    $('#dynamicMeme').empty();
    $('#memeCreationPage').addClass('hidden');
    $('#homePage').removeClass('hidden');

  }

  function updateMeme(id) {
    console.log('Updating meme `' + id + '`');
    $.ajax({
      url: memeCreation_URL + '/' + id,
      method: 'PUT',
      success: function(data) {
        console.log('success');
      }
    });
  }
  
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

    $('#createAccount').click(function() {
      console.log('signUp');
      $('.signUp').addClass('hidden');
      $('.logIn').removeClass('hidden');
    });

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

    $('#enterApp').click(function() {
      console.log('logged in');
      $('.logIn').addClass('hidden');
      $('.profile').removeClass('hidden');
    });

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
      dateDifference();
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

    $('.memeBanner').on('keyup', '.clickableIcon', function(event) {
      if (event.keyCode === 13) {
        $(this).click();
      }
    });
  
  }
  
  
  $(function() {
    handleEventListeners();
    $(".fadeOutHeader").fadeOut(15000);
    datePickerCalendar();
  });