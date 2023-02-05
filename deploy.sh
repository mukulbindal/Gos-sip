# Usage:: chmod +x deploy.sh && ./deploy.sh
echo `pwd`;
ls -lrt;
export APP_DIR=`pwd`;
echo $APP_DIR;
# server setup
echo "========Starting the server setup========";
npm i;
echo "========Server Setup Completed===========";

# SSL Setup
echo "========Starting SSL Setup if keys not present==========";
#cd ./backend;
SSL_PATH=$APP_DIR/backend/bin;
if [ ! -f $SSL_PATH/server.key ]; then
    #create new SSL
    echo "Creating new SSL" 
    rm -rf $SSL_PATH;
    mkdir $SSL_PATH;
    #Generate a key
    cd $SSL_PATH;
    openssl genrsa -out server.key 2048;
    echo "Generating CSR";
    echo "We are on hostname=${hostname}";
    openssl req -new -key server.key -out server.csr -subj "//A=B/C=IN/ST=UP/L=Kanpur/O=SeaGreen/OU=Owlbox/CN=owlbox.onrender.com/emailAddress=the.owl.box.project@outlook.com/";
    echo "Removing Passphrase";
    cp server.key server.key.org;
    openssl rsa -in server.key.org -out server.key;
    echo "Generating certificate";
    openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt;
    
fi
echo "========Exiting  SSL Setup =============================";
# Build front End
echo "========Building Front End =============================";
cd $APP_DIR/frontend;
npm i;
npm run-script build;
echo "========Finished Building  =============================";
export NODE_ENV=production
# Start the App
# Not required in Render
# node backend/server.js
echo "====Done=================================================";

