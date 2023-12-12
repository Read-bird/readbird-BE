EXIST_NGINX=$(docker ps | grep readbird)

if [ -z "$EXIST_NGINX" ]; then 
    docker-compose -p readbird -f /home/ec2-user/deploy/conf.d/docker-compose.yml down
fi 
    docker-compose -p readbird -f /home/ec2-user/deploy/conf.d/docker-compose.yml up -d
  
exit 0