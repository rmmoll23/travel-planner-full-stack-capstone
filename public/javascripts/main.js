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
      console.log('signUp');
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
      console.log('signUp');
      $('.profile').addClass('hidden');
      $('.newTrip').removeClass('hidden');
    });

    // newTrip listeners 

    $('#createTrip').click(function() {
      console.log('signUp');
      $('.newTrip').addClass('hidden');
      $('.activitySelection').removeClass('hidden');
    });

    $('#cancelTrip').click(function() {
      console.log('signUp');
      $('.newTrip').addClass('hidden');
      $('.profile').removeClass('hidden');
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


    // key listeners
    
    $('.memeBanner').on('keyup', '.clickableIcon', function(event) {
      if (event.keyCode === 13) {
        $(this).click();
      }
    });
  
  }
  
  
  $(function() {
    handleEventListeners();
    $(".fadeOutHeader").fadeOut(6000);
  });