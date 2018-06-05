'use strict';

//Displays warning and informational messages to the user.
function alertUser(msg) {
	console.log(msg);
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
	$('#signUpForm').submit((e) => {
        $('body').loader('show');
        console.log('submit');
		e.preventDefault();
		const username = $('#signUp-username').val().trim();
		const password = $('#signUp-password').val().trim();
		const passwordB = $('#signUp-passwordB').val().trim();
        const firstName = $('#signUp-firstName').val().trim();
        console.log(username, password, passwordB, firstName);

		//Make sure no empty strings will be submitted, then 
		if (username != '' && password != '') {
            // Make sure username and password is at least 5 characters
            if (username.length >= 5 && password.length >= 5) {
                //Make sure passwords match.
                if (password === passwordB) {
                    const newSignUpObject = {
                        username: username,
                        password: password,
                        firstName: firstName
                    };
                    $.ajax({
                        type: 'POST',
                        url: serverBase + '/api/users/',
                        dataType: 'json',
                        data: JSON.stringify(newSignUpObject),
                        contentType: 'application/json'
                    })
                    .done(function (result) {
                        if (result.username) {
                            console.log('account created');
                            $('.signUp').addClass('hidden');
                            $('.logIn').removeClass('hidden');
                            $('body').loader('hide');
                            alert('Sign up successful');
                    } else {
                        clearInputs();
                        const alertInvalid = 'Please enter a valid username and/or password.';
                        alertUser(alertInvalid);
                    }
                    })
                    .fail(function (jqXHR, error, errorThrown) {
                        console.log(jqXHR);
                        console.log(error);
                        console.log(errorThrown);
                        clearInputs();
                        const alertError = err;
                        alertUser(alertError);
                    });
                    // $.ajax({
                    //     contentType: 'application/json',
                    //     //contentType and processData must be set to false when using FormData
                    //     contentType: false,
                    //     processData: false,
                    //     data: JSON.stringify(newSignUpObject),
                    //     success: function(result){
                    //         if (result.username) {
                    //                 console.log('account created');
                    //                 $('.signUp').addClass('hidden');
                    //                 $('.logIn').removeClass('hidden');
                    //         } else {
                    //             clearInputs();
                    //             const alertInvalid = 'Please enter a valid username and/or password.';
                    //             alertUser(alertInvalid);
                    //         }
                    //     },
                    //     error: function(err){
                    //         clearInputs();
                    //         const alertError = err;
                    //         alertUser(alertError);
                    //     },
                    //     type: 'POST',
                    //     url: serverBase + '/api/users/'
                    // });
                } else {
                    const alertMessage = `Passwords don't match.`;
                    alertUser(alertMessage);
                }
            } else {
                const alertMessage = 'Username and Password must be at least 5 characters in length';
                alertUser(alertMessage);
            }
		} else {
			const alertMessage = 'Please enter a first name, username, and password.';
			alertUser(alertMessage);
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