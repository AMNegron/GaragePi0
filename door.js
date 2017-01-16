


<script>
    webiopi().ready(function() {
        	var content, content2, button, content3, button3;
		content  = $("#content");
		content2 = $("#openCloseButton"); $(checkStatus);
		content3 = $("#optionsBtn");

	// GPIO 7 = Relay
	// GPIO17 = Garage Light
	// GPIO18 = Door Sensor
	    webiopi().setFunction(7,"in");
	    webiopi().setFunction(17,"out");
	    webiopi().setFunction(18,"in");

    // create an "OPEN" labeled button for GPIO 18
        button = webiopi().createGPIOButton(18, "");
        content2.append(button); // append button to content div

    // create main garage button that calls the ButtonPrsd function below
        button = webiopi().createButton("button", "GARAGE DOOR", showConfirm );
        content.append(button); // append button to content div

    // create options button that calls the showOptions function below
        button3 = webiopi().createButton("options", "OPTIONS", showOptions );
        content3.append(button3); // append button to content div

	// checks status of door sensor	
	    function checkStatus() {
		if (	$('#gpio18').hasClass('LOW')) {
		    	$("#gpio18").html('CLOSED');
			}else {
		    	$("#gpio18").html('OPEN');
			}
		setTimeout(checkStatus,1000)
		}

	// gets called by the ButtonPrsd function below - sets gpio7 back to 'IN'
		function ButtonRls() {
			webiopi().setFunction(7,"in");
		}

    // hide the confirmation box div
	    function hideConfirm() {
            document.getElementById('confirmBox').style.visibility = "hidden";
            document.getElementById('confirmText').style.visibility = "hidden";
        }

	// sets gpio7 to 'OUT' which will trip relay.
	// After .5 second, calls hideConfirm above,
	// hides the confirmation div and changes door image
		function ButtonPrsd() {
            document.getElementById('button').style.background = "#808080 url('/door-action2.gif') no-repeat center top";
			webiopi().setFunction(7,"out");
			hideConfirm();
			setTimeout(ButtonRls, 500);
    // Set time (in ms) to display action image ex: 12000
			setTimeout(ImgNormal, 12000); 
		}

	// show confirmation div after pressing garage door button
		function showConfirm() {
			document.getElementById('yes').onclick = ButtonPrsd;
			document.getElementById('no').onclick = hideConfirm;
			document.getElementById('confirmBox').style.visibility = "visible";
			document.getElementById('confirmText').style.visibility = "visible";
		}
				
	// change action-image to normal
		function ImgNormal() {
			document.getElementById('button').style.background = "#808080 url('/door-static3.png') no-repeat center bottom";
		}

// The following functions are used for the options control display -->

	// show options div after pressing OPTIONS button
		function showOptions() {
			document.getElementById('log').onclick = optionsLog;
			document.getElementById('light').onclick = optionsLight;
			document.getElementById('optionsBox').style.visibility = "visible";
			document.getElementById('optionsText').style.visibility = "visible";
		}				

	// hide the optionsbox div
		function hideOptions() {
			document.getElementById('optionsBox').style.visibility = "hidden";
			document.getElementById('optionsText').style.visibility = "hidden";
        }

        function optionsLog() {
			hideOptions;
			window.location.href = '/garage.log';
		}

	// Toggle Light Value
        function optionsLight() {
           	hideOptions;
			webiopi().toggleValue(17);
		}

	// constantly refresh status to see if door is open or closed
		webiopi().refreshGPIO(true)
		}
	);

    </script>
