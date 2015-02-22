# Pull base image.
FROM dockerfile/elasticsearch


# Define default command.
CMD ["/elasticsearch/bin/elasticsearch", "-Des.http.cors.allow-origin=*","-Des.http.cors.enabled=true"]

EXPOSE 9200
EXPOSE 9300
