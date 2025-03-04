<?php
include 'config-cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'OrderService.php';

$o = new OrderService();
$o->orderCheckout();
?>
