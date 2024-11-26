<?php 
include 'config-cors.php';

session_start();
session_unset();
session_destroy();

echo json_encode(["success" => true, "data" => $_SESSION['user']]); // reforçar que é nulo e sempre deve ser nulo!
?>
