


============= SOFTWARE =============

Download latest stable Raspian {during the inital writing of this guide, Jessie Lite and Raspberry Pi (RasPi) Zero (RPZ) was used}

Write .img file to SDCard
Insert SDCard into RPZ
Connect USB Hub to USB cable Adapter to RPZ
Connect WiFi and KB/M to USB Hub
Connect HDMI Cable to mini-HDMI Adapter to RPZ
Connect power to RPZ

================= SECTION BREAK =======================
{ /// Connect to Wi-Fi network \\\ }
{ https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md }

{ if using GUI, connect to your local network once RasPi is powered on. 
{ Continue with next section => Setup RPZ settings }

{ if using CLI, continue below }
{ If needed, Scan for available networks and look for ESSID as the network_name }
    $ sudo iwlist wlan0 scan

{ Edit wps_supplicant.conf file, specify SSID and password for your network }
    $ sudo nano /etc/wpa_supplicant/wpa_supplicant.conf

{ /// COPY & PASTE FOLLOWING CODE \\\ to the end of the wpa_supplicant.conf file }

network={
    ssid="network_name"
    psk="wifi_password"
}

{ \\\ END CODE /// }

{ Restart RasPi}
    $ sudo reboot

{ Verify successful connection by running following code and if the inet addr field has an address beside it, the RasPi has connected to the network. }
    $ ifconfig wlan0

{ \\\ End of Wi-Fi network setup /// }

================= SECTION BREAK =======================
{ Setup RPZ settings }

(1) {GUI} 
    Menu...Preferences...Raspberry Pi Configuration
or

(2) {CLI} 
    $ sudo raspi-config

{ Change User Password - HIGHLY recommended!! }
{ Expand FileSystem to utilize entire SD Card - Recommended }
{ Change Boot option to auto-login - if desired}
    (1) System
    (2) Main Menu

{ Enable SSH - HIGHLY recommended!! }
{ Enable Remote GPIO Server }
{ Enable VNC server if desired } 
    (1) Interfaces
    (2) Advanced Options

{ Rename the RPZ computer } 
    (1) System...Hostname
    (2) Advanced Options...Hostname

{ Change Localizations - Time Zone, Keyboard Layout, Wi-Fi }
    (1) Localisation
    (2) Main Menu

    $ exit config 

{ Reboot or Shutdown as desired }
    $ sudo reboot
    
    $ sudo shutdown-h now
    
{ At this point if you decide to continue with SSH/CLI, you can shutdown RasPi and remove USB Hub, KB/M and HDMI Cable }
{ If using RPZ, Connect the WiFi dongle to either USB-to-MicroUSB adapter and connect directly to RPZ}

================= SECTION BREAK =======================
{ Find Updates, Apply Upgrades, then Clean-up }

    $ sudo apt-get update
    $ sudo apt-get dist-upgrade
    $ sudo apt-get install git
    $ sudo apt-get clean

================= SECTION BREAK =======================
### WEBIOPI INSTALL ###

{ /// Install WebIOPi \\\ }
{ http://webiopi.trouch.com/INSTALL.html }
    $ cd /home/pi

{ Required to access all 40 pins [new Raspberry layout] }
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

================= READ BELOW BEFORE INSTALL =======================

{ If you only need local network access to your setup or, }
{ If you want outside internet access to your setup and are comfortable with port forwarding, }
{ Answer NO to internet access question if presented. OTHERWISE }
{ If yes is chosen, must follow instructions to install Weaved IoT Kit at http://webiopi.trouch.com/INSTALL.html }
{ or you can utilize CAYENNE software at http://www.cayenne-mydevices.com/docs/#introduction }
{ Download Cayenne App https://itunes.apple.com/us/app/cayenne-connect-create-control/id1057997711?ls=1&mt=8 }

{ I have no experience with either platform, so no additional guidance will be provided }

================= READ ABOVE BEFORE INSTALL =======================

{ set WebIOPi to start at boot}
    $ sudo update-rc.d webiopi defaults

{ To change or remove username & password to access WEBIOPI, }
{ http://webiopi.trouch.com/PASSWORD.html }

{ To change: }
    $ sudo webiopi-passwd

{ To remove, delete contents or delete file /etc/webiopi/passwd }
    $ sudo nano /etc/webiopi/passwd
    $ sudo rm /etc/webiopi/passwd

{ Restart WebIOPi }
    $ sudo /etc/init.d/webiopi restart
    
{ Reboot RasPi }
    $ sudo reboot

\\\ END WEBIOPI INSTALL ///

================= SECTION BREAK =======================
{ Location of HTML files }
{ The index.html should be left in place for WebIOPi. }
{ It can be replaced, but it should be backed-up }
{ Best practice would be to directly access your own HTML landing page i.e. door.html }

    $ cd /usr/share/webiopi/htdocs

{ Transfer project files }

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
{ Code copied and edited from comments section of :
{ http://www.driscocity.com/idiots-guide-to-a-raspberry-pi-garage-door-opener/ }

    $ cd /
    $ sudo nano /usr/bin/door_status

{ /// COPY & PASTE file contents from file Door_Status \\\ }

{ Make this script executable: }
    $ sudo chmod 777 /usr/bin/door_status
    $ cd /etc
    $ sudo nano rc.local

{ add the following line just above “exit 0”, to have door_status startup on bootup.}

{ /// COPY & PASTE FOLLOWING CODE \\\ }

/usr/bin/door_status > /dev/null 2>&1 &

{ \\\ END CODE /// }

{need to add code to edit garage.html to create link to garage.log}

{ \\\ END DOOR STATUS modification /// }

    $ sudo reboot


================= SECTION BREAK =======================
{ To change images, you can rename your images to door-action.png & door-static.png }
{ Alternatively, you can change the file names in the .css and .js files in three locations }

background: #808080 url(‘door-static.png’) no-repeat center bottom;
document.getElementById(‘button’).style.background = “#808080 url(‘/door-action.gif’) no-repeat center bottom”;
document.getElementById(‘button’).style.background = “#808080 url(‘/door-static.png’) no-repeat center bottom”;


============= HARDWARE =============
{ If Edimax Wi-fi Adapter keeps going to sleep, you can try the following to fix the issue }
{ https://www.raspberrypi.org/forums/viewtopic.php?t=61665 }

    $ sudo nano /etc/modprobe.d/8192cu.conf

{ /// COPY & PASTE FOLLOWING CODE \\\ }

# Disable power management
options 8192cu rtw_power_mgnt=0 rtw_enusbss=0

{ \\\ END CODE /// }


================= SECTION BREAK =======================

{ In a future lesson, we will enable the PiCam to allow a video-feed from the garage }
{ https://docs.google.com/document/d/1RQ9Vf-_Ty5UuMGdkD0zEaDtdCNYjwhDSWnd29Ql6a2I/edit }
