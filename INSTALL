# Install Instructions

These instructions assume you are using Windows 10 with WSL

## Initial set up

### Set up WSL (Windows Subsystem for Linux)

1) Download Windows Terminal from the Microsoft Store:

https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701#activetab=pivot:overviewtab

2) Open up a new instance of PowerShell in Windows Terminal (or regular powershell) and execute the command:

```
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

3) Download the Ubuntu 20.04 for WSL app from the Microsoft Store:

https://www.microsoft.com/en-us/p/ubuntu-2004-lts/9n6svws3rx71#activetab=pivot:overviewtab

4) Open an instance of ubuntu from the start menu or windows search. This will begin to set up the Ubuntu instance. Follow the on screen instructions.

5) Now you should be able to open an instance of Ubuntu in the Windows Terminal, do so and run: 

```
sudo apt update
sudo apt upgrade
```

6) Close all instances of Ubuntu on your machine.

### Upgrade to WSL 2

1) Open up a PowerShell instance **as an administrator**. Execute the following command to upgrade to WSL2:

```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

2) Restart your computer.

3) Download and execute the .msi file linked below. This is an upgrade for the linux kernel for WSL2. Follow on screen instructions.

https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

4) Run the following command in a new powershell instance: (This may take a few minutes to complete.)

```
wsl --set-version Ubuntu-20.04 2
```

5) Run `wsl -l -v` and check to see that the VERSION for Ubuntu 20,04 is "2". If it is not, something went wrong.

### Install Dependencies

1) Open a new instance of Ubuntu in Windows Terminal.

2) Do the following commands to install golang:

```
sudo add-apt-repository ppa:longsleep/golang-backports
sudo apt update
sudo apt install golang-go
```

3) Run `go version` and make sure the output is 'go version go1.17 linux/amd64'.

4) Do the following commands to install NodeJS:

```
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

5) Run `node --version` and make sure the output is 'v14.17.6'.

6) Do the following commands to install MongoDB:

```
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
```

This should return 'OK'. (If an error is thrown instead, run `sudo apt-get install gnupg` and try again).

Then, run:

```
sudo touch /etc/apt/sources.list.d/mongodb-org-5.0.list
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db
```

7) Run `mongod --version` and make sure the output is 'db version v5.0.2'

### Initial Repo setup.

1) Open up and instance of Ubuntu and run the following command to get the source code:

```
git clone https://github.com/COSC481W-2021Fall/capstone-7-Deadly-Bugs.git
```

2) cd to `frontent/flashfolio/` and run the following command to install npm dependencies:

```
npm install
```

3) cd to `backend/flashfolio/` and run the following command to install golang dependencies:

```
go mod download
```

### Starting an instance locally

1) Open up 3 different instances of Ubuntu in Windows Terminal.

2) In one instance, start MongoDB by running:

```
mongod
```

3) In the next instance, start the backend by cd-ing into `backend/flashfolio` and running:

```
go run .
```

4) In the last instance, start the frontend by cd-ing into `frontend/flashfolio` and running:

```
npm start
```

An instance of you browser should appear running the website.



