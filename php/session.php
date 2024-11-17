<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();

if (isset($_SESSION['user'])) {
    echo json_encode([
        "loggedIn" => true,
        "user" => $_SESSION['user']
    ]);
} else {
    echo json_encode(["loggedIn" => false]);
}

session_write_close();
?>

