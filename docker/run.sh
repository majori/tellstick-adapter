#!/bin/bash
set -e

# Expose the unix socket to internal network
socat TCP-LISTEN:50800,reuseaddr,fork UNIX-CONNECT:/tmp/TelldusClient &
socat TCP-LISTEN:50801,reuseaddr,fork UNIX-CONNECT:/tmp/TelldusEvents &

# Run telldus-core daemon
exec /usr/local/sbin/telldusd --nodaemon > /dev/null
