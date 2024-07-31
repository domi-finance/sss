# Step 1: Zip your project files excluding the virtual environment
cd /Users/ayocrypt/PycharmProjects/TGM.BET
zip -r TGM.BET.zip . -x "venv/*" or tar --exclude='venv' -czvf TGM.BET.tar.gz *


# Step 2: Transfer the zipped file to your AWS server
scp TGM.BET.zip root@47.252.35.18:/root/TGM_BET

# Step 3: SSH into your AWS server
ssh root@47.252.35.18

# Step 4: Navigate to the project directory and unzip the file
cd /root/TGM_BET
unzip TGM.BET.zip

# Step 5: Remove the zip file after extraction (optional)
rm TGM.BET.zip

# Step 6: Create a supervisor configuration for your application
cat <<EOT > /etc/supervisor/conf.d/tgm_bet.conf
[program:tgm_bet]
command=/root/TGM_BET/venv/bin/python /root/TGM_BET/main.py
directory=/root/TGM_BET
autostart=true
autorestart=true
stderr_logfile=/var/log/tgm_bet.err.log
stdout_logfile=/var/log/tgm_bet.out.log
EOT

# Step 7: Reload supervisor to apply the new configuration
supervisorctl reread
supervisorctl update

# Step 8: Start the application using supervisor
supervisorctl start tgm_bet

# GitHub steps:

# Step 9: Initialize a new Git repository and commit the files
cd /Users/ayocrypt/PycharmProjects/TGM.BET
git init
git add .
git commit -m "live Support function"

# Step 10: Add the remote repository
git remote add origin https://github.com/tgm-labs/TGM.BET.git

# Step 11: Push the local repository to GitHub
# If the default branch is 'main', use:
git push -u origin main

# If the default branch is 'master', use:
git push -u origin master


#Pull the latest changes from the remote main branch and rebase
git pull origin main --rebase
