<?php 
include_once 'ResponseHandler.php';
include_once 'Database.php';
include_once 'verifica-ip.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$response = ['steps' => [], 'errors' => []];

// tb_usuario (
?>
