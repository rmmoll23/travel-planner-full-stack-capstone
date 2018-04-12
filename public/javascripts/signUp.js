'use strict';

//Displays warning and informational messages to the user.
function alertUser(msg) {
	alert(msg);
}

//Clears most important fields on a rejected attempt.
function clearInputs() {
    $('#signUp-firstName').val('');
    $('#signUp-username').val('');
	$('#signUp-password').val('');
	$('#signUp-passwordB').val('');
}

//Watches signup form click, intercepts default post behavior, performs light validation, and sends data to create the user.
function handleSignupClick() {
	//TODO: Experiment with Google reCaptcha on this form
	$('#signupForm').submit((e) => {
		e.preventDefault();
		const username = $('#signUp-username').val();
		const password = $('#signUp-password').val();
		const passwordB = $('#signUp-passwordB').val();
		const firstName = $('#signUp-firstName').val();

		//Make sure no empty strings will be submitted, then 
		if (username != '' && password != '') {
            // Make sure username and password is at least 5 characters
            if (username.length >= 5 && password.length >= 5) {
                //Make sure passwords match.
                if (password === passwordB) {
                    let formData = new FormData;
                    //Add form variables to form data with correct keys
                    formData.append('username', username);
                    formData.append('password', password);
                    formData.append('firstName', firstName);
                    $.ajax({
                        contentType: 'application/json',
                        //contentType and processData must be set to false when using FormData
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function(result){
                            if (result.username) {
                                    console.log('account created');
                                    $('.signUp').addClass('hidden');
                                    $('.profile').removeClass('hidden');
                            } else {
                                clearInputs();
                                const alertInvalid = 'Please enter a valid username and/or password.';
                                alertUser(alertInvalid);
                            }
                        },
                        error: function(err){
                            clearInputs();
                            const alertError = err.responseJSON.message;
                            alertUser(alertError);
                        },
                        type: 'POST',
                        url: '/users'
                    });
                } else {
                    const alertBlank = `Passwords don't match.`;
                    alertUser(alertBlank);
                }
            } else {
                const alertBank = 'Username and Password must be at least 5 characters in length';
                alertUser(alertBank);
            }
		} else {
			const alertBlank = 'Please enter a first name, username, and password.';
			alertUser(alertBlank);
		}
	});
}

//Document ready callback function - powers the page.
function renderSignupPage() {
	//Sent to bottom of stack, otherwise form post is not intercepted.
	setTimeout(() => { 
		handleSignupClick();
    }, 0);
}

$(renderSignupPage);