<?php
function verifica_limite_ip_redis() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $response["steps"][] = ["1. Leu ip: " . $ip];

    $redis = new Redis();
    $connected = $redis->connect('127.0.0.1', 6379);
    $response["steps"][] = $connected 
        ? "2. Conexão com Redis bem-sucedida!" 
        : "2. Falha na conexão com Redis.";

    if ($connected) {
        $ipBasedCounter = "ip_counter:" . $ip;
        $contadorIpAtual = $redis->get($ipBasedCounter) ?? 0;

        if ($contadorIpAtual >= 10) {
            return ["success" => false];
        } else {
            $contadorIpAtual = $redis->incr($ipBasedCounter);
            $redis->expire($ipBasedCounter, 60);
            $response["steps"][] = "4. Número de acessos do IP $ip: $contadorIpAtual";
        }
    }

    return ["success" => true];
}

$resultado = verifica_limite_ip_redis();

if (!$resultado['success']) {
    echo json_encode([
        "message" => "Limite de acessos atingido ou erro de conexão.",
        "success" => false
    ]);
    exit();
}
?>
