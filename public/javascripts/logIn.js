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
				contentType: 'application/json',
				data: JSON.stringify(loginParams),
				dataType: 'json',
				success: function(response){
					if (response.authToken) {
						console.log('logged in');
                        $('.logIn').addClass('hidden');
                        $('.profile').removeClass('hidden');
					} else {
						clearInputs();
						const alertInvalid = 'Please enter a valid username and/or password.';
						alertUser(alertInvalid);
					}
				},
				error: function(){
					const alertError = 'Error encountered in POST.';
					alertUser(alertError);
				},
				type: 'POST',
				url: serverBase + '/api/auth/login'
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