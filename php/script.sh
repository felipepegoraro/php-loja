#!/bin/bash

dir=/var/www/html/php-loja-back

sudo cp -v .php-loja-env "$dir"
sudo cp -v *.php "$dir"

# if [ ! -d "$dir/cart" ]; then
#     sudo mkdir -p "$dir/cart"
# fi
#
# sudo cp -v cart/*.php "$dir/cart"
