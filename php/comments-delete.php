<?php 
include_once 'CommentService.php';

$cms = new CommentService();

$data = json_decode(file_get_contents('php://input'), true);
$response = ["steps" => [], "errors" => []];

$delete = (bool)($data['delete'] ?? false);
$commentId = $data['commentId'] ?? -1;

// ERASE
// se for passado delete, apagar de fato o comentário
if ($delete && $commentId != -1){
    $cms->userDeleteComment($commentId);
    exit;
}

// se nao tiver delete...
$allComments = (bool) ($data['all'] ?? false);
$userId = $data['userId'] ?? -1;

// DELETED USER
// ...move todos comentários do usuário ou apenas determinado comentário
if ($allComments && $userId != -1) $cms->reassignAllCommentsFromUser($userId);
elseif ($commentId != -1) $cms->reassignCommentToDeletedUser($commentId);
?>
