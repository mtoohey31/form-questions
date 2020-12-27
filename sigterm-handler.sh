#!/usr/bin/env sh

# The source for this script was the following article: https://medium.com/@gchudnov/trapping-signals-in-docker-containers-7a57fdda7d86#.6b04xvnr8

set -x

pid=0

# SIGTERM-handler
term_handler() {
  if [ $pid -ne 0 ]; then
    kill -SIGTERM "$pid"
    wait "$pid"
  fi
  rm -rf /app/public/build
  exit 143; # 128 + 15 -- SIGTERM
}

# setup handler
# on callback, kill the last background process, which is `tail -f /dev/null` and execute the specified handler
trap 'kill ${!}; term_handler' SIGTERM

# run application
npm run build
npm start build &
pid="$!"

# wait forever
while true
do
  tail -f /dev/null & wait ${!}
done
