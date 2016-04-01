#!/bin/bash

# should execute this script from inside the ../tw5-public directory
# takes 2 params 
# projectName -  used to name directories and new scripts 
# hostPort - the port that the host will run on (not the auth port)
#
# Example: ./build-tw-project.sh FooProject 8080
#

# project info
echo "HostPort: "$2 > $1'.info'


# make a dir for the auth module
# use the name from param for cleaner ps view
mkdir $1'TW-auth'

# create the tw5 project
tiddlywiki tw5 --init server




# build the start script
b='start-'$1'-tw5.sh'
touch $b
b1='TW_'$1
b2='TW_AUTH_'$1

# append into script
echo '#!/bin/bash' >> $b
echo '' >> $b
echo 'tiddlywiki tw5 --server '$2' &> tw5.log &' >> $b
echo 'export TW_'$1'_PID=$!' >> $b
echo '' >> $b
echo 'node '$1'TW-auth/app.js &> twAuth.log  &' >> $b
echo 'export TW_AUTH_'$1'_PID=$!' >> $b


# give it permission to execute
chmod a+x $b


