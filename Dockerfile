# Pull base image.
FROM dockerfile/elasticsearch


# Define default command.
CMD ["/elasticsearch/bin/elasticsearch"]

EXPOSE 9200
EXPOSE 9300
