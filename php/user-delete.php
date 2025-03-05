<?php 
include_once 'UserService.php';
include_once 'config-cors.php';

session_start();

$data = json_decode(file_get_contents("php://input"), true);

$response = [];

if (isset($data['idUsuario'])){
    $idUsuario = $data['idUsuario'];
    $us = new UserService();
    $us->deleteUserFullScheme($idUsuario);
}
?>
