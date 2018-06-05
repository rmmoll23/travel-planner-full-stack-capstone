'use strict';

// Function displays error and informational messages for users.
function alertUser(msg) {
	alert(msg);
}

//Clears most important fields on a rejected attempt.
function clearInputs() {
	$('#logIn-username').val() = '';
	$('#logIn-password').val() = '';
}

//Watches login form click, intercepts default post behavior, performs light validation, and sends data to validate the attempt. On success, writes the JWT token to local storage to validate future endpoint and page calls for the next seven days.
function handleLoginSubmit() {
	$('#enterApp').click(function(e) {
		console.log ('submitLogIn');
		$('body').loader('show');
		e.preventDefault();
		const uname = $('#logIn-username').val();
		const pword = $('#logIn-password').val();

		//Make sure no empty strings will be submitted, then 
		if (uname != '' && pword != '') {
			const loginParams = {
				username: uname,
				password: pword
			};
			$.ajax({
				type: 'POST',
				url: serverBase + '/api/auth/login',
				dataType: 'json',
				data: JSON.stringify(loginParams),
				contentType: 'application/json'
			})
				.done(function (response) {
					if (response.authToken) {
						console.log('logged in');
						localStorage.setItem("username", uname);
						getFirstName(uname);
						getTripList(uname);
						$('.logIn').addClass('hidden');
						$('.profile').removeClass('hidden');
						$('body').loader('hide');
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
					const alertError = 'Error encountered in POST.';
					alertUser(alertError);
				});
			
		} else {
			const alertBlank = 'Please enter a username and / or password.';
			alertUser(alertBlank);
		}
	});
}

//Document ready callback function - powers the page.
function renderLoginPage() {
	handleLoginSubmit();
}

//Document close to ready calls the functions that power the page.
$(renderLoginPage);