<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();
session_unset();
session_destroy();
echo json_encode(["success" => true, "data" => $_SESSION['user']]); // reforçar que é nulo e sempre deve ser nulo!
?>
