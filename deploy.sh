EXIST_NGINX=$(docker ps | grep front-web)
if [ -z "$EXIST_NGINX" ]; then 
    docker compose -p front-web -f /home/ec2-user/deploy/conf.d/docker-compose.yml down
fi 
    docker compose -p front-web -f /home/ec2-user/deploy/conf.d/docker-compose.yml up -d
  
exit 0