#!/bin/bash

RED='\033[0;31m'
NC='\033[0m'

echo "Is Hadoc already installed(upgrading)?"
select yn in "Yes" "No"; do
	case $yn in 
		Yes ) cd ~; rm -r -f hadoc_file_sharing; break;;
		No ) break;;
	esac
done

printf "${RED}Cloning from GitHub ${NC}\n"

git clone https://github.com/lucaryholt/hadoc_file_sharing.git

cd hadoc_file_sharing

printf "${RED}Running 'npm i' ${NC}\n"

npm i

printf "${RED}What ip?${NC}\n"

read ip

printf "${RED}What port?${NC}\n"

read port

printf "${RED}What directory should be used for uploads? (Needs to exist)${NC}\n"

read dir

printf "${RED}What should be max upload size? (Only number in MB)${NC}\n"

read mx

printf "${RED}Running app ${NC}\n"

clear

node app.js --ip $ip --port $port --dir $dir --mxSize $mx --sV
