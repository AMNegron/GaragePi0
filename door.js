	webiopi().ready(function() {
        	var mainbtn, sensorbtn, optbtn, button, button3;
		mainbtn  = $("#content");
		sensorbtn = $("#openCloseButton"); $(checkStatus);
		optbtn = $("#optionsBtn");

	// GPIO 7 = Relay
	// GPIO17 = Light
	// GPIO18 = Sensor#1
	    webiopi().setFunction(7,"in");
	    webiopi().setFunction(18,"in");
	    webiopi().setFunction(17,"out");

    // create an "OPEN" labeled button for door1/sensor1
        button = webiopi().createGPIOButton(18, "");
        sensor1.append(button); // append button to sensor1 div

    // create main door button that calls the ButtonPrsd function below
        button = webiopi().createButton("button", "MAIN DOOR", showConfirmFnc );
        mainbtn.append(button); // append button to mainbtn div

    // create options button that calls the showOptions function below
        button3 = webiopi().createButton("button", "OPTIONS", showOptionsFnc );
        optbtn.append(button3); // append button3 to optbtn div

	// checks status of sensor#1. After checking wait 1 sec (1000 milliseconds)	
	    function checkStatus1() {
			if (	$('#gpio18').hasClass('LOW')) {
		    	$("#gpio18").html('CLOSED');
				}
			else {
		    	$("#gpio18").html('OPEN');
				}
			setTimeout(checkStatus1,1000)
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

	// change normal-image to action
		function ImgAction() {
			document.getElementById('button').style.background = "#808080 url('/door-action.gif') no-repeat center top";
		}
		
	// change action-image to normal
		function ImgNormal() {
			document.getElementById('button').style.background = "#808080 url('/door-static.png') no-repeat center bottom";
		}

	// sets gpio7 to 'OUT' which will trip relay & changes to action-image.
	// After .5 second (500 millisec), calls ButtonRls & hideConfirm above.
	// After 12 sec (12000 millisec), returns to static image.
		function ButtonPrsd() {
			webiopi().setFunction(7,"out");
			ImgAction();
			setTimeout(ButtonRls, 500);
			hideConfirm();
			setTimeout(ImgNormal, 12000); 
		}

	// show confirmation div after pressing mainbtn
		function showConfirmFnc() {
			document.getElementById('yes').onclick = ButtonPrsd;
			document.getElementById('no').onclick = hideConfirm;
			document.getElementById('confirmBox').style.visibility = "visible";
			document.getElementById('confirmText').style.visibility = "visible";
		}


// The following functions are used for the options control display.

	// show options div after pressing OPTIONS button
		function showOptionsFnc() {
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
