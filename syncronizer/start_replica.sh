#!/bin/bash
# Define Hostnames
networkdrive="bridge"
networkname="mongo_replica_net"
h1="mongo1"
h2="mongo2"
h3="mongo3"

# Create network for replica set
docker network create -d $networkdrive $networkname

# Start containers with specific hostnames and replica set name
docker run -P --name mongo1 --hostname="$h1" --network $networkname -d mongo:3.4.19-jessie --replSet ttnd --noprealloc --smallfiles
docker run -P --name mongo2 --hostname="$h2" --network $networkname -d mongo:3.4.19-jessie --replSet ttnd --noprealloc --smallfiles
docker run -P --name mongo3 --hostname="$h3" --network $networkname -d mongo:3.4.19-jessie --replSet ttnd --noprealloc --smallfiles
 
# # Commands to extract IP addresses of containers
# echo $(docker inspect --format '{{ .NetworkSettings.IPAddress }}' ttnd1) "$h1" > getip.txt
# echo $(docker inspect --format '{{ .NetworkSettings.IPAddress }}' ttnd2) "$h2" >> getip.txt
# echo $(docker inspect --format '{{ .NetworkSettings.IPAddress }}' ttnd3) "$h3" >> getip.txt
#  
# # Commands to cp getip.txt to containers
# docker cp getip.txt ttnd1:/etc
# docker cp getip.txt ttnd2:/etc
# docker cp getip.txt ttnd3:/etc
#  
# # Commands to create new file updateHost.sh (to update /etc/hosts file in all the three docker containers)
# echo "#!/bin/bash
# cat /etc/hosts > /etc/hosts1
# sed -i '/ttnd.com/d' /etc/hosts1
# cat /etc/getip.txt >> /etc/hosts1
# cat /etc/hosts1 > /etc/hosts" > updateHost.sh
#  
# # Change permission of updateHost.sh and cp files to docker container
# chmod +x updateHost.sh
# docker cp updateHost.sh ttnd1:/etc
# docker cp updateHost.sh ttnd2:/etc
# docker cp updateHost.sh ttnd3:/etc
# docker exec -it ttnd1 chmod +x /etc/updateHost.sh
# docker exec -it ttnd2 chmod +x /etc/updateHost.sh
# docker exec -it ttnd3 chmod +x /etc/updateHost.sh
#  
# # Execute scripts on all the three containers
# docker exec -it ttnd1 /etc/updateHost.sh
# docker exec -it ttnd2 /etc/updateHost.sh
# docker exec -it ttnd3 /etc/updateHost.sh

# Start MongoDB Replica Set with Primary
docker exec -it mongo1 mongo --eval "rs.status()"
docker exec -it mongo1 mongo --eval "db"
docker exec -it mongo1 mongo --eval "rs.initiate()"
sleep 2
docker exec -it mongo1 mongo --eval "rs.add(\"$h2:27017\")"
docker exec -it mongo1 mongo --eval "rs.add(\"$h3:27017\")"
docker exec -it mongo2 mongo --eval "rs.slaveOk()"
docker exec -it mongo3 mongo --eval "rs.slaveOk()"