## How to make your own DoorPiZero ##

***============= SOFTWARE =============***
1. Download latest stable Raspian {during the inital writing of this guide, Jessie was used}
   https://www.raspberrypi.org/downloads/
2. Write .img file to SDCard
3. Insert SDCard into RPi
4. Connect USB Hub to USB Adapter to RPi
5. Connect WiFi and KB/M to USB Hub
6. Connect HDMI Cable to mini-HDMI Adapter to RPi
7. Connect power to RPi

**=== /// Connect to Wi-Fi network \\\ ===**

*Additional details at https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md*

* If using GUI, connect to your local network once RPi is powered on. 
  * Continue to next section ** Setup RPi Settings **

* If using CLI/terminal, continue below
  * If needed, Scan for available networks and look for ESSID as the network_name
      >$ sudo iwlist wlan0 scan

 * Edit wps_supplicant.conf file, specify SSID and password for your network
      >$ sudo nano /etc/wpa_supplicant/wpa_supplicant.conf

### /// COPY & PASTE FOLLOWING CODE .. to the end of the wpa_supplicant.conf file \\\ ###
      network={
         ssid="network_name"
         psk="wifi_password"
         key_mgmt=WPA-PSK
      }
### \\\ END CODE /// ###

* Restart RPi
   >$ sudo reboot
   
* Verify successful connection by running following code
 * If the inet addr field has an address beside it, the RPi has connected to the network
   >$ ifconfig wlan0

* Shutdown RPi
   >$ sudo shutdown -h now

{ At this point if you decide to continue with SSH/CLI, you can shutdown RPi and remove USB Hub, KB/M and HDMI Cable }
{ Connect the WiFi dongle to the USB-to-MicroUSB adapter and connect to RPi0 }

========== Setup RPi settings ==========

(1) {GUI} Menu...Preferences...Raspberry Pi Configuration
or
(2) {CLI} 
    $ sudo raspi-config

{ Change User Password - HIGHLY recommended!! }
{ Change Boot option to CLI - recommended }
{ Change Boot option to auto-login - if desired}
    (1) System
    (2) Main Menu

{ Enable SSH - HIGHLY recommended!! }
{ Enable Remote GPIO Server }
{ Enable VNC server if desired } 
    (1) Interfaces
    (2) Advanced Options

{ Rename the RPi computer } 
    (1) System...Hostname
    (2) Advanced Options...Hostname

{ Change Localizations - Time Zone, Keyboard Layout, Wi-Fi }
    (1) Localisation
    (2) Main Menu

    $ exit config 

    $ sudo reboot

================= SECTION BREAK =======================
{ Find Updates, Apply Upgrades, then Clean-up }

    $ sudo apt-get update
    $ sudo apt-get dist-upgrade
    $ sudo apt-get clean
    $ sudo apt-get install git

================= SECTION BREAK =======================
### CAYENNE INSTALL ###

{ http://www.cayenne-mydevices.com/docs/#introduction
{ Download Cayenne App https://itunes.apple.com/us/app/cayenne-connect-create-control/id1057997711?ls=1&mt=8

\\\ END CAYENNE INSTALL ///

================= SECTION BREAK =======================
### WEBIOPI INSTALL ###

{ /// Install WebIOPi \\\ }
{ http://webiopi.trouch.com/INSTALL.html }
    $ cd /home/pi

{ Required to access all 40 pins [new RPi layout] }
{ https://github.com/thortex/rpi3-webiopi/wiki/HowToBuild }

{ download}
    $ wget http://sourceforge.net/projects/webiopi/files/WebIOPi-0.7.1.tar.gz

{ unzip}
    $ tar xvzf WebIOPi-0.7.1.tar.gz

{ Patch}
    $ cd
    $ git clone https://github.com/acrobotic/Ai_Demos_RPi
    $ cd WebIOPi-0.7.1
    $ patch -p0 -i ~/Ai_Demos_RPi/demos/gpio/webiopi_raspberry_pi_2_cpu_support.patch 
    $ patch -p0 -i ~/Ai_Demos_RPi/demos/gpio/webiopi_raspberry_pi_2_gpio_40_pin.patch 
    $ patch -p0 -i ~/Ai_Demos_RPi/demos/gpio/webiopi_raspberry_pi_2_gpio_mapping.patch




{ install}
    $ sudo ./setup.sh

{ If you only need local network access to your setup or, }
{ If you want outside internet access to your setup and are comfortable with port forwarding, }
{ Answer NO to internet access question if presented. }
{ Otherwise... }
{ If yes is chosen, must follow instructions to install Weaved IoT Kit at http://webiopi.trouch.com/INSTALL.html }

{ set WebIOPi to start at boot}
    $ sudo update-rc.d webiopi defaults

    $ sudo reboot

{ To change or remove username & password to access WEBIOPI, }
{ http://webiopi.trouch.com/PASSWORD.html }

{ To change: }
    $ sudo webiopi-passwd

{ To remove, delete contents or delete file /etc/webiopi/passwd }
    $ sudo nano /etc/webiopi/passwd

{ Restart WebIOPi }
    $ sudo /etc/init.d/webiopi restart

\\\ END WEBIOPI INSTALL ///


================= SECTION BREAK =======================
{ HTML files located at ... }

    $ cd /usr/share/webiopi/htdocs

{ Transfer project files }

    $ cd /usr/share/webiopi/htdocs
    $ sudo wget https://www.dropbox.com/s/3lz5od3xyqxl17i/garage.html
    $ sudo wget https://www.dropbox.com/s/f3qfwvjqgzft16m/door-static.png
    $ sudo wget https://www.dropbox.com/s/xj93wymxebbthu0/door-action.gif
    $ sudo wget https://www.dropbox.com/s/k1a429mix66hshr/appicon.png

    $ wget http://www.driscocity.com/rpi/open.png
    $ wget http://www.driscocity.com/rpi/closed.png

{ If desired, you can edit WebIOPi config to redirect to custom location, change port, etc}
    $ sudo nano /etc/webiopi/config


================= SECTION BREAK =======================
{ *** DOOR STATUS log *** }
{ http://www.driscocity.com/idiots-guide-to-a-raspberry-pi-garage-door-opener/ }

    $ cd /
    $ sudo nano /usr/bin/garage_status

{ /// COPY & PASTE FOLLOWING CODE \\\ }

#!/bin/bash

# Garage Log process started - Write today's date to log files
# Using -printf- command to print line break to visualize reboot in log 
#   - Alternatively, you can uncomment the following two lines to start new logs on every reboot

# rm /usr/share/webiopi/htdocs/garage.log
# rm /var/log/garage.log

printf "\nPennyPupster Tracker started at " >> /var/log/garage.log
date >> /var/log/garage.log

printf "\nPennyPupster Tracker started at " >> /usr/share/webiopi/htdocs/garage.log
date >> /usr/share/webiopi/htdocs/garage.log

# GPIO 18 is used as the door sensor. Must be changed in two places if different (Lines 17 & 26)
echo "18" > /sys/class/gpio/export

# Loop this whole script
while true

do
# Assign the previous value (stored in file /usr/bin/garage_state) & get the current status of GPIO pin
# Make sure to update GPIO value to the door sensor
STATE_PRV=$(</usr/bin/garage_state)
STATE_CUR=$(</sys/class/gpio/gpio18/value)

# ====================================
# STATE_TEXT > go   = open
# STATE_TEXT > stay = closed

if [ $STATE_CUR = 1 ]
then
       STATE_TEXT='GO'
else
       STATE_TEXT='STAY'
fi

# ====================================
if [ "$STATE_PRV" = "$STATE_CUR" ]
then
       sleep 5
else
       date >> /var/log/garage.log
       echo "PennyPupster Tracker " $STATE_CUR >> /var/log/garage.log
       echo " 1=Open, 0=Closed" >> /var/log/garage.log

       STR1=$(date +%F)" "$(date +%R)
       echo $STR1 "PENNY is" $STATE_TEXT >> /usr/share/webiopi/htdocs/garage.log

       echo $STATE_CUR > /usr/bin/garage_state
fi
       date

done

{ \\\ END CODE /// }

{ Make this script executable: }
    $ sudo chmod 777 /usr/bin/garage_status
    $ cd /etc
    $ sudo nano rc.local

{ add the following line just above “exit 0”, to have garage_status startup on bootup.}

{ /// COPY & PASTE FOLLOWING CODE \\\ }

/usr/bin/garage_status > /dev/null 2>&1 &

{ \\\ END CODE /// }

{need to add code to edit garage.html to create link to garage.log}

{ \\\ END DOOR STATUS modification /// }

    $ sudo reboot


================= SECTION BREAK =======================
{ to change dog pic, edit garage.html in three places, or you can just rename your images to doge-action.png & doge-static.png}
background: #808080 url(‘doge-static.png’) no-repeat center bottom;
document.getElementById(‘button’).style.background = “#808080 url(‘/doge-action.png’) no-repeat center bottom”;
document.getElementById(‘button’).style.background = “#808080 url(‘/doge-static.png’) no-repeat center bottom”;



============= HARDWARE =============
{ If Edimax Wi-fi Adapter keeps going to sleep, you can do the following to fix the issue }
{ https://www.raspberrypi.org/forums/viewtopic.php?t=61665 }

    $ sudo nano /etc/modprobe.d/8192cu.conf

{ /// COPY & PASTE FOLLOWING CODE \\\ }

# Disable power management
options 8192cu rtw_power_mgnt=0 rtw_enusbss=0

{ \\\ END CODE /// }




================= SECTION BREAK =======================

{ In a future lesson, we will enable the PiCam to allow a video-feed from the garage }
{ https://docs.google.com/document/d/1RQ9Vf-_Ty5UuMGdkD0zEaDtdCNYjwhDSWnd29Ql6a2I/edit }
