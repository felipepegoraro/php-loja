<?php 
include "config-cors.php";
include_once "CommentService.php";

$c = new CommentService();

$itemId = $_GET['itemId'] ?? null;
if ($itemId != null){
    $c->getComments($itemId);
}
?>
