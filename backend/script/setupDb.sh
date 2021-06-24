echo "Setting up Full Stack Database"

echo "You will be prompted for the MySQL root password"
read -s DB_ROOT_PW
echo "Password is ${DB_ROOT_PW}"
mysql -u root -p$DB_ROOT_PW < ./createDb.sql
mysql -u root -p$DB_ROOT_PW < ./insertData.sql