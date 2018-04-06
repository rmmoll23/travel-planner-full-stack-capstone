'use strict';
  
  const serverBase = 'https://meme-generator-capstone.herokuapp.com/';
  // const serverBase = '//localhost:8080/';
  const photoSelection_URL = serverBase + 'photos';
  const memeCreation_URL = serverBase + 'memes';
  
  
  function getAndDisplayMemeFeed_top() {
    $('body').loader('show');
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
      $('body').loader('hide');
    });
  }

  function getAndDisplayMemeFeed_recent() {
    $('body').loader('show');
    const memeRecent_URL = memeCreation_URL + '/recent';
    $.getJSON(memeRecent_URL, function(memes) {
      console.log('Rendering recent memes');
      const memeFeedRecent = memes.map(function(meme) {
        const memeFeedTemplate = 
        `<div class='parent'>
        <img class='mySlides' id='${meme._id}' src='${meme.memeURL}'>
        <span tabIndex=2 aria-label='Click if you like this meme' class='clickableMemeIcon' id='${meme._id}'><i class='far fa-star'></i><span class='likeCount'>${meme.liked}</span></span>
        <button tabIndex=1 aria-label='Click to move left through the meme feed' class='navButtons' id='displayLeft' onclick='plusDivs(-1)'>&#10094;</button>
        <button tabIndex=1 aria-label='Click to move right through the meme feed' class='navButtons' id='displayRight' onclick='plusDivs(1)'>&#10095;</button>
       </div>`;
        return memeFeedTemplate;
      })
      $('.memeBanner').empty();
      $('.memeBanner').append(memeFeedRecent);
      slideIndex = 1;
      showDivs(1);
      $('body').loader('hide');
    });
  }

  function getAndDisplayPhotoFeed_top() {
    $('body').loader('show');
    const photoTop_URL = photoSelection_URL + '/top';
    $.getJSON(photoTop_URL, function(photos) {
      console.log('Rendering top photos');
      const photoFeedTop = photos.map(function(photo) {
        const photoSelectionTemplate = 
          `<div class='parent'>
            <div class='photo'>
              <img class='mySlides' id='${photo._id}' src='${photo.photoURL}'>
              <span tabIndex=2 aria-label='Click if you like this photo' class='clickableIcon' id='${photo._id}'><i class='far fa-star'></i><span class='likeCount'>${photo.liked}</span></span>
              <button tabIndex=1 aria-label='Click to move left through the photo feed' class='navButtons' id='displayLeft' onclick='plusDivs(-1)'>&#10094;</button>
              <button tabIndex=1 aria-label='Click to move right through the photo feed' class='navButtons' id='displayRight' onclick='plusDivs(1)'>&#10095;</button>
            </div>
            <button class='selectPhotoButton' id='${photo._id}' type='button'>Create meme with this photo</button>
           </div>`;
        return photoSelectionTemplate;
      })
      $('.memeBanner').empty();
      $('.photoBanner').empty();
      $('.photoBanner').append(photoFeedTop);
      slideIndex = 1;
      showDivs(1);
      $('body').loader('hide');
    });
  }

  function getAndDisplayPhotoFeed_recent() {
    $('body').loader('show');
    const photoRecent_URL = photoSelection_URL + '/recent';
    $.getJSON(photoRecent_URL, function(photos) {
      console.log('Rendering recent photos');
      const photoFeedRecent = photos.map(function(photo) {
        const photoSelectionRecentTemplate = 
          `<div class='parent'>
            <div class='photo'>
              <img class='mySlides' id='${photo._id}' src='${photo.photoURL}'>
              <span tabIndex=2 aria-label='Click if you like this photo' class='clickableIcon' id='${photo._id}'><i class='far fa-star'></i><span class='likeCount'>${photo.liked}</span></span>
              <button tabIndex=1 aria-label='Click to move left through the photo feed' class='navButtons' id='displayLeft' onclick='plusDivs(-1)'>&#10094;</button>
              <button tabIndex=1 aria-label='Click to move right through the photo feed' class='navButtons' id='displayRight' onclick='plusDivs(1)'>&#10095;</button>
            </div>
            <button class='selectPhotoButton' id='${photo._id}' type='button'>Create meme with this photo</button>
          </div>`;
        return photoSelectionRecentTemplate;
      })
      $('.memeBanner').empty();
      $('.photoBanner').empty();
      $('.photoBanner').append(photoFeedRecent);
      slideIndex = 1;
      showDivs(1);
      $('body').loader('hide');
    });
  }

  function getAndDisplayPhotoById(id) {
    console.log('Retrieving photo to display')
    const photoChoice_URL = photoSelection_URL + '/' + id;
    $.getJSON(photoChoice_URL, function(photo) {
      const memeTemplate = `<div id='dynamicMeme'><h1 class='memeHeader'>Create your Meme</h1>
      <div class='imgChoice'>
      <div class='memeContainer' style='background-image: url(${photo.photoURL})'>
      <div id='textBox'>hello</div></div></div>
      <form id='memeSubmit'>
      <label for='phrase'>Input text for meme:</label>
      <input type='text' id='phrase' onkeyup='memeText()'/><br>
      <button class='submitMemeButton' type='submit'>Submit Meme</button>
      </form></div>`;
      $('#dynamicMeme').empty();
      $('#memeCreationPage').prepend(memeTemplate);
      $('#photoSelectionPage').addClass('hidden');
      $('#memeCreationPage').removeClass('hidden');
    });
  }
  
  // function addPhoto(photo) {
  //   console.log(photo);
  //   $.ajax({
  //     method: 'POST',
  //     url: photoSelection_URL,
  //     data: JSON.stringify(photo),
  //     dataType: 'json',
  //     contentType: 'application/json'
  //   });
  // }

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

  function memeText() {
    let input = $('#phrase').val();
    let div = $('#textBox').html();
    if (input !== div) {
        $('#textBox').empty();
        $('#textBox').append(input);
    }
  }
  
  function handleEventListeners() {

    $('.home').on('click', '#create', function(event) {
      $('#homePage').addClass('hidden');
      $('#photoSelectionPage').removeClass('hidden');
      getAndDisplayPhotoFeed_top();
    });
  
    // $('#photoUpload').submit(function(event) {
    //   event.preventDefault();
    //   const photo = $(event.currentTarget).find('#newPhoto').val();
    //   addPhoto({photoURL: photo,
    //   liked: 0});
    //   const createMemeTemplate = `<div id='dynamicMeme'><h1>Create your Meme</h1>
    //   <div class='imgChoice'>
    //   <div class='memeContainer' style='background-image: url(${photo})'>
    //   <div id='textBox'></div></div></div>
    //   <form id='memeSubmit'>
    //   <label for='phrase'>Input text for meme:</label>
    //   <input type='text' id='phrase' onkeyup='memeText()'/><br>
    //   <button class='submitMemeButton' type='submit'>Submit Meme</button>
    //   </form></div>`;
    //   $('#memeCreationPage').empty();
    //   $('#memeCreationPage').prepend(createMemeTemplate);
    //   $('#photoSelectionPage').addClass('hidden');
    //   $('#memeCreationPage').removeClass('hidden');
    // });

    $('.photoBanner').on('click', '.clickableIcon', function(){
      console.log('liked');
      let icon = $(event.target);
      if (!icon.hasClass('clickableIcon')) {
        icon = icon.closest('.clickableIcon');
      }
      const starId = icon.attr('id');
      console.log(starId);

      let likeCount = $(this).parent().find('.likeCount').text();
      likeCount++;
      console.log(likeCount);
      $(this).parent().find('.likeCount').empty();
      $(this).parent().find('.likeCount').append(likeCount); 

      updatePhoto(starId);
    });

    $('.memeBanner').on('click', '.clickableMemeIcon', function(){
      console.log('liked');
      let memeIcon = $(event.target);
      console.log(memeIcon);
      if (!memeIcon.hasClass('clickableMemeIcon')) {
        memeIcon = memeIcon.closest('.clickableMemeIcon');
      }
      const memeId = memeIcon.attr('id');
      let likeCount = $(this).parent().find('.likeCount').text();
      likeCount++;
      console.log(likeCount);
      $(this).parent().find('.likeCount').empty();
      $(this).parent().find('.likeCount').append(likeCount); 
      
      console.log(memeId);
      updateMeme(memeId);
    });

    $('.photoBanner').on('click', '.selectPhotoButton', function(){
      const buttonId = $(event.target).attr('id');
      console.log(buttonId);
      getAndDisplayPhotoById(buttonId);
    });

    $('#memeFilter').click(function() {
      $('#memeFilter').toggleClass('checked');
      let classState = $('#memeFilter').attr('class');
      console.log(classState);
      if (classState === 'checked') {
        console.log('true');
        $('#recent').addClass('selectedFilter');
        $('#top').removeClass('selectedFilter');
        getAndDisplayMemeFeed_recent();
      }
      
      else {
        console.log('false');
        $('#top').addClass('selectedFilter');
        $('#recent').removeClass('selectedFilter');
        getAndDisplayMemeFeed_top();
        
      }
    })

    $('#photoFilter').click(function() {
      $('#photoFilter').toggleClass('checked');
      let classState = $('#photoFilter').attr('class');
      console.log(classState);
      if (classState === 'checked') {
        console.log('true');
        $('#recentPhoto').addClass('selectedFilter');
        $('#topPhoto').removeClass('selectedFilter');
        getAndDisplayPhotoFeed_recent();
      }
      
      else {
        console.log('false');
        $('#topPhoto').addClass('selectedFilter');
        $('#recentPhoto').removeClass('selectedFilter');
        getAndDisplayPhotoFeed_top();
        
      }
    })

    $('#memeCreationPage').on('click', '.submitMemeButton', function(){
      event.preventDefault();
      console.log('snapshot');
      html2canvas(document.querySelector('.memeContainer')).then(canvas => {
        const memeDataURL = canvas.toDataURL();
        addMeme(memeDataURL);
      });
    });

    $('#navBarMemePageToHome').click(function() {
      console.log('first');
      $('#memeCreationPage').addClass('hidden');
      $('#homePage').removeClass('hidden');
      $('.photoBanner').empty();
      getAndDisplayMemeFeed_top();
    });

    $('#navBarMemePageToPhoto').click(function() {
      $('#memeCreationPage').addClass('hidden');
      $('#photoSelectionPage').removeClass('hidden');
      $('#dynamicMeme').empty();
    });

    $('#navBarPhotoPage').click(function() {
      console.log('second');
      $('#photoSelectionPage').addClass('hidden');
      $('#homePage').removeClass('hidden');
      $('.photoBanner').empty();
      getAndDisplayMemeFeed_top();
    });

    $('.memeBanner').on('keyup', '.clickableIcon', function(event) {
      if (event.keyCode === 13) {
        $(this).click();
      }
    });

    $('.photoBanner').on('keyup', '.clickableIcon', function(event) {
      if (event.keyCode === 13) {
        $(this).click();
      }
    });
  
  }
  
  
  $(function() {
    handleEventListeners();
    getAndDisplayMemeFeed_top();
  });