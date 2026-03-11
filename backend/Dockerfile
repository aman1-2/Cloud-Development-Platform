FROM ubuntu:20.04

# Setup User
RUN  useradd -ms /bin/bash code 

# Setup Working Directory
WORKDIR /home/code

#update the ubuntu machine
RUN apt update && apt upgrade -y

# Install nano and curl
RUN apt install nano curl -y

# Install NodeJs
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && apt-get install -y nodejs

# Configuring Terminal to display current working directory
RUN echo "PS1='\w '" >> /home/code/.bashrc

# Setup Final Working Directory
WORKDIR /home/code/app