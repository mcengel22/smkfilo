<?php

namespace App\Modules\Comment\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Comment\Services\CommentService;
use App\Modules\Comment\Http\Requests\CommentRequest;
use App\Modules\Comment\Http\Resources\CommentResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class CommentController extends Controller
{
    use HandlesApiExceptions;

    protected $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    public function index(): JsonResponse
    {
        $data = $this->commentService->all();
        return $this->successResponse(CommentResource::collection($data));
    }


    public function store(CommentRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $comment = $this->commentService->create($validatedData);
            return $this->createdResponse($comment);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->commentService->find($id);
        return $this->successResponse(new CommentResource($data));
    }

    public function update(CommentRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $comment = $this->commentService->update($id, $validatedData);
            return $this->updatedResponse($comment);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->commentService->delete($id);
        return $this->deletedResponse();
        });
    }

    public function getCommentsByUser(): JsonResponse
    {
        // Giriş yapan kullanıcının id'sini alıyoruz
        $userId = auth()->user()->id;

        // Kullanıcıya ait yorumları alıyoruz
        $comments = $this->commentService->getCommentsByUser($userId);

        if ($comments->isEmpty()) {
            // Yorum bulunamadıysa 404 dönüyoruz
            return response()->json(['message' => 'Bu kullanıcıya ait yorum bulunamadı.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => CommentResource::collection($comments)
        ]);
    }


    // post_id'ye göre yorumları getirme
    public function getCommentsByPost($postId = null): JsonResponse
    {
        // 🧠 Eğer $postId null ise tüm yorumları çek
        $comments = $postId
            ? $this->commentService->getCommentsByPost($postId)
            : $this->commentService->getAllComments(); // 👈 ekleyeceğiz

        if ($comments->isEmpty()) {
            return response()->json(['message' => 'Yorum bulunamadı.'], 200);
        }

        return response()->json([
            'success' => true,
            'data' => CommentResource::collection($comments)
        ]);
    }


    // Yorum onaylama
    public function approve($id): JsonResponse
    {
        $comment = $this->commentService->approveComment($id);

        return response()->json([
            'success' => true,
            'data' => new CommentResource($comment)
        ]);
    }

    // Yorum reddetme
    public function reject($id): JsonResponse
    {
        $comment = $this->commentService->rejectComment($id);

        return response()->json([
            'success' => true,
            'data' => new CommentResource($comment)
        ]);
    }
}
