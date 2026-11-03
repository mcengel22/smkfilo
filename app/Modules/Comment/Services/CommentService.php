<?php

namespace App\Modules\Comment\Services;

use App\Modules\Comment\Models\Comment;
use App\Modules\Comment\Repositories\CommentRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
class CommentService
{
    protected $commentRepository;

    public function __construct(CommentRepository $commentRepository)
    {
        $this->commentRepository = $commentRepository;
    }

    public function all()
    {
        return $this->commentRepository->all();
    }

    public function create(array $data)
    {
        return $this->commentRepository->create($data);
    }

    public function find($id)
    {
        return $this->commentRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->commentRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->commentRepository->delete($id);
    }

    // Kullanıcıya ait yorumları getirme
    public function getCommentsByUser($userId)
    {
        $comments = $this->commentRepository->getCommentsByUser($userId);

        // Burada boş koleksiyon kontrolü yapılabilir
        return $comments;
    }




    // post_id'ye göre yorumları getirme
    public function getCommentsByPost($postId)
    {
        return $this->commentRepository->getCommentsByPost($postId);
    }
    public function getAllComments()
    {
        return $this->commentRepository->getAllComments();
    }


    // Yorum onaylama
    public function approveComment($id)
    {
        $comment = $this->commentRepository->findById($id);

        if (!$comment) {
            throw new ModelNotFoundException("Comment not found");
        }

        $comment->status = 'approved';
        $comment->save();

        return $comment;
    }

    // Yorum reddetme
    public function rejectComment($id)
    {
        $comment = $this->commentRepository->findById($id);

        if (!$comment) {
            throw new ModelNotFoundException("Comment not found");
        }

        $comment->status = 'rejected';
        $comment->save();

        return $comment;
    }
}
