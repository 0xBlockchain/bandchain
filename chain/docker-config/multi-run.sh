#!/bin/bash

bandd init $1 --chain-id=bandchain

cp /zoracle/docker-config/$1/priv_validator_key.json ~/.bandd/config/priv_validator_key.json
cp /zoracle/docker-config/$1/node_key.json ~/.bandd/config/node_key.json
cp /zoracle/docker-config/genesis.json ~/.bandd/config/genesis.json

# add cors in config.toml
cd ~/.bandd/config/
sed 's/cors_allowed_origins = \[\]/cors_allowed_origins = \["\*"\]/g' config.toml > config_tmp.toml
mv config_tmp.toml config.toml
cd /zoracle/

if [ "$1" == "query-node" ];then
    bandd start --rpc.laddr tcp://0.0.0.0:26657 --with-db "postgres: host=172.18.0.88 port=5432 user=postgres dbname=postgres password=postgrespassword sslmode=disable" \
    --p2p.persistent_peers 11392b605378063b1c505c0ab123f04bd710d7d7@172.18.0.11:26656,0851086afcd835d5a6fb0ffbf96fcdf74fec742e@172.18.0.12:26656,7b58b086dd915a79836eb8bfa956aeb9488d13b0@172.18.0.21:26656 --uptime-look-back 20
else
    bandd start --rpc.laddr tcp://0.0.0.0:26657 \
    --p2p.persistent_peers 11392b605378063b1c505c0ab123f04bd710d7d7@172.18.0.11:26656,0851086afcd835d5a6fb0ffbf96fcdf74fec742e@172.18.0.12:26656,7b58b086dd915a79836eb8bfa956aeb9488d13b0@172.18.0.21:26656
fi

