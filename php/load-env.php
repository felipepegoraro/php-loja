<?php

// criar o seu arquivo .php-loja-env:

// DB_HOST=
// DB_NAME=
// DB_USER=
// DB_PASS=

function loadEnv($path = '.php-loja-env') {
    if (!file_exists($path)) {
        throw new Exception("Arquivo .env não encontrado.");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) {
            continue;
        }

        list($key, $value) = explode('=', $line, 2);

        $key = trim($key);
        $value = trim($value);

        putenv("$key=$value");

        $_ENV[$key] = $value;
    }
}

loadEnv();
?>
