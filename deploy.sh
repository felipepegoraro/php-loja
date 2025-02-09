#!/bin/bash

USER="ubuntu"
SERVER="php-loja.com"
PEM_FILE="$1"
WEB_DIR="/var/www/html"
ENVPROD="./.env.production"
ENVLOCAL="./.env.local"


function show_help() {
    echo "Uso: $0 <arquivo.pem> {frontend|php|permissions}"
    echo ""
    echo "Argumentos:"
    echo "  <arquivo.pem>   Caminho para o arquivo .pem de autenticação SSH"
    echo "  frontend        Faz o build e transfere arquivos do frontend para o servidor"
    echo "  php             Transfere os arquivos PHP para a pasta privada no servidor"
    echo "  permissions     Ajusta as permissões do diretório no servidor"
    echo ""
    echo "Opções:"
    echo "  --help          Mostra esta mensagem de ajuda"
}


function check_arguments() {
    if [[ "$1" == "--help" ]]; then
        show_help
        exit 0
    fi
    

    if [[ -z "$PEM_FILE" ]]; then
        echo "Erro: Arquivo .pem não especificado."
        echo "Uso: $0 <arquivo.pem> {frontend|php|permissions}"
        exit 1
    fi

    if [[ ! -f "$PEM_FILE" || "$PEM_FILE" != *.pem ]]; then
        echo "Erro: Arquivo .pem inválido ou não encontrado: $PEM_FILE"
        exit 1
    fi

    if [[ -z "$2" ]]; then
        echo "Erro: Tipo de operação não especificado."
        echo "Uso: $0 <arquivo.pem> {frontend|php|permissions}"
        exit 1
    fi
}


function restart_apache(){
    ssh -i "$PEM_FILE" $USER@$SERVER <<EOF
        sudo systemctl restart apache2
EOF
}


function server_permissions(){
    ssh -i "$PEM_FILE" $USER@$SERVER <<EOF
        sudo usermod -aG www-data $USER

        sudo chown -R ${USER}:www-data $WEB_DIR
        sudo chmod -R 775 $WEB_DIR/

        sudo chown -R ${USER}:www-data $WEB_DIR/private/
        sudo chmod -R 775 $WEB_DIR/private/
EOF

    echo "OK: permissões alteradas com sucesso";
}


function temporarily_modify_build_production_env_file(){
    prod=$(grep -oP '(?<==)"[^"]*' $ENVPROD | tr -d '"')
    local=$(grep -oP '(?<==)"[^"]*' $ENVLOCAL | tr -d '"')

    original_local=$local
    sed -i "s|${local}|${prod}|" $ENVLOCAL
}

function local_transfer_frontend(){
    npm install

    # modificar temporariamente o ENVLOCAL para usar a configuração de produção
    temporarily_modify_build_production_env_file
    NODE_ENV=production npm run build
    sed -i "s|$(grep -oP '(?<==)"[^"]*' $ENVLOCAL | tr -d '"')|$original_local|" $ENVLOCAL   

    # [ALTERNATIVA]
    # scp -i $HOME/ec2-loja-php.pem -r build/* ubuntu@php-loja.com:/var/www/html/

    rsync -avz \
        -e "ssh -i $PEM_FILE" \
        --progress \
        --chown=$USER:www-data \
        --chmod=775 \
        build/ \
        $USER@$SERVER:$WEB_DIR/

    echo "status da transferencia: $?"
    restart_apache
}


function local_move_php(){
    ssh -i "$PEM_FILE" $USER@$SERVER "mkdir -p ${WEB_DIR}/private"

    # [ALTERNATIVA]
    # scp -i "$PEM_FILE" -r php/*.php $USER@$SERVER:${WEB_DIR}/private

    rsync -avz \
        -e "ssh -i $PEM_FILE" \
        --progress \
        --chown=$USER:www-data \
        --chmod=775 \
        php/*.php \
        $USER@$SERVER:${WEB_DIR}/private/

    echo "status da transferencia: $?"
    restart_apache
}


check_arguments "$@"


case $2 in
    "frontend") local_transfer_frontend ;;
    "php") local_move_php ;;
    "permissions") server_permissions ;;
    *) 
        echo "Erro: Comando inválido: $2"
        echo "Uso: $0 <arquivo.pem> {frontend|php|permissions}"
        echo "Use '$0 --help' para mais informações."
        exit 1
        ;;
esac
