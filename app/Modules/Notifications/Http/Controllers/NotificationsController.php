<?php

namespace App\Modules\Notifications\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Notifications\Repositories\NotificationsRepository;
use App\Modules\Notifications\Services\NotificationsService;
use App\Modules\Notifications\Http\Requests\NotificationsRequest;
use App\Modules\Notifications\Http\Resources\NotificationsResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class NotificationsController extends Controller
{
    protected $service;

    public function __construct(NotificationsService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $userId = auth()->id();
        $notifications = $this->service->getUserNotifications($userId);

        return NotificationsResource::collection($notifications);
    }

    public function markAsRead($id)
    {
        $success = $this->service->markAsRead($id);

        return response()->json([
            'success' => $success
        ]);
    }
}
