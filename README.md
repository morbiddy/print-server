

1. Install pkg
npm install -g pkg

2. Build the Executable
pkg server.js --targets node18-win-x64,node18-macos-x64 --output print-server

This will generate:
print-server-win.exe (Windows)
print-server-macos (macOS)

3. Run the Executable
On Windows: print-server-win.exe
On macOS: ./print-server-macos

**********************************
🖥️ Windows: Install as a Service
**********************************

Method 1: Use nssm (Recommended)
--------------------------------

NSSM (Non-Sucking Service Manager) allows you to register print-server-win.exe as a Windows Service, so it starts automatically.

1. Install NSSM
Download NSSM from https://nssm.cc/download and extract it to C:\nssm.

2. Install the Print Server as a Service
Run this in Command Prompt (Admin): C:\nssm\nssm.exe install PrintServer

Application → C:\path\to\print-server-win.exe
Startup directory → C:\path\to\
Click Install Service.

3. Start the Service
net start PrintServer

✅ Now the print server will start automatically on Windows boot.

4. To Remove the Service
C:\nssm\nssm.exe remove PrintServer confirm

Method 2: Add to Windows Startup Folder
---------------------------------------

If you don’t want to install a Windows Service, you can make print-server-win.exe run at login.

1. Open the Startup Folder
Press Win + R, type: shell:startup
Press Enter. This opens the Startup folder.

2. Add the Print Server
Create a shortcut to print-server-win.exe.
Place it in the Startup folder.
✅ Now the print server will launch whenever the user logs in.

**************************************
🍏 macOS: Install as a Launch Daemon
**************************************

To make the print server run at startup, use launchd.

1. Create a Launch Daemon File
sudo nano /Library/LaunchDaemons/com.print-server-macos.plist

2. Add This Configuration
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>Label</key>
        <string>com.print-server-macos</string>
        <key>ProgramArguments</key>
        <array>
            <string>/path/to/print-server-macos</string>
        </array>
        <key>RunAtLoad</key>
        <true/>
        <key>KeepAlive</key>
        <true/>
    </dict>
</plist>

3. Load the Service
sudo launchctl load /Library/LaunchDaemons/com.print-server-macos.plist

✅ Now the print server will start automatically on macOS boot.

4. To Remove the Service
sudo launchctl unload /Library/LaunchDaemons/com.print-server-macos.plist
sudo rm /Library/LaunchDaemons/com.print-server-macos.plist

*****************
🛠️ Final Testing
*****************

✅ Windows
Reboot Windows → print-server-win.exe should start.
Run: tasklist | findstr print-server-win.exe
If you see print-server-win.exe, it’s running!

✅ macOS
Reboot macOS.
Run: launchctl list | grep print-server-macos
If com.print-server-macos appears, it's running.
