<?php

namespace App\Modules\Reservation\Http\Controllers;

use App\Enums\OrderBy;
use App\Enums\OrderDirection;
use App\Enums\ReservationState;
use App\Enums\ReservationStatus;
use App\Enums\UserRole;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Modules\Post\Models\Post;
use App\Modules\Reservation\Http\Requests\FilterReservationRequest;
use App\Modules\Reservation\Http\Requests\SearchReservationRequest;
use App\Modules\Reservation\Http\Resources\ManuelReservationResource;
use App\Modules\Reservation\Http\Resources\MusteriReservationResource;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\Reservation\Repositories\ReservationRepository;
use App\Modules\Reservation\Services\ReservationService;
use App\Modules\Reservation\Http\Requests\ReservationRequest;
use App\Modules\Reservation\Http\Resources\ReservationResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    use HandlesApiExceptions;

    protected ReservationService $reservationService;
    protected ReservationRepository $reservRepo;

    public function __construct(ReservationService $reservationService,ReservationRepository $reservRepo)
    {
        $this->reservationService = $reservationService;
        $this->reservRepo = $reservRepo;
    }

    public function index(): JsonResponse
    {
        $data = $this->reservationService->all();
        return $this->successResponse(ReservationResource::collection($data));
    }


    public function store(ReservationRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();

            // Kullanıcı bilgisi varsa, user'ı servise gönderiyoruz, yoksa null
            $user = $request->user ? $request->user : null;

            $reservation = $this->reservationService->create($validatedData, $user);

            return $this->createdResponse($reservation);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->reservationService->find($id);
        return $this->successResponse(new ReservationResource($data));
    }

    public function update(ReservationRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $reservation = $this->reservationService->update($id, $validatedData);
            return $this->updatedResponse($reservation);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->reservationService->delete($id);
        return $this->deletedResponse();
        });
    }


    public function filter(FilterReservationRequest $request): JsonResponse
    {
        $user = auth()->user();

        $pagination     = $request->get('pagination', []);
        $perPage        = $pagination['perPage']    ?? 10;
        $page           = $pagination['pageNumber'] ?? 1;
        $pName          = $pagination['pName']      ?? 'page';
        $sort           = $request->get('sort', []);
        $orderBy        = $sort['by']        ?? OrderBy::CREATED_AT->value;
        $orderDirection = $sort['direction'] ?? OrderDirection::DESC->value;

        $reservations = Reservation::query()
            ->with('dealer') // Bayi ilişkisini yükle
            ->filter($request)           // dynamic status/state filtreleri
            ->byUserRole($user)          // ← artık controller’da tek satır
            ->orderBy($orderBy, $orderDirection)
            ->paginate($perPage, ['*'], $pName, $page);

        return $this->successResponse([
            'data'       => ReservationResource::collection($reservations),
            'pagination' => [
                'current_page' => $reservations->currentPage(),
                'total'        => $reservations->total(),
                'per_page'     => $reservations->perPage(),
                'last_page'    => $reservations->lastPage(),
                'next_page_url'=> $reservations->nextPageUrl(),
                'prev_page_url'=> $reservations->previousPageUrl(),
            ],
        ]);
    }


    public function rootByPost(Request $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $post = Post::where('slug', $request[0])->firstOrFail();

            $reservations = Reservation::where('post_id', $post->id)
                ->get();

            return $this->successResponse(ReservationResource::collection($reservations));
        });
    }

    public function userByFilter(FilterReservationRequest $request): JsonResponse
    {
        $user = auth()->user();


        $pagination     = $request->get('pagination', []);
        $perPage        = $pagination['perPage']    ?? 10;
        $page           = $pagination['pageNumber'] ?? 1;
        $pName          = $pagination['pName']      ?? 'page';
        $sort           = $request->get('sort', []);
        $orderBy        = $sort['by']        ?? OrderBy::CREATED_AT->value;
        $orderDirection = $sort['direction'] ?? OrderDirection::DESC->value;

        $reservations = Reservation::query()
            ->with('dealer') // Bayi ilişkisini yükle
            ->filter($request)           // dynamic status/state filtreleri
            ->byUserReservation($user)          // ← artık controller’da tek satır
            ->orderBy($orderBy, $orderDirection)
            ->paginate($perPage, ['*'], $pName, $page);

        return $this->successResponse([
            'data'       => MusteriReservationResource::collection($reservations),
            'pagination' => [
                'current_page' => $reservations->currentPage(),
                'total'        => $reservations->total(),
                'per_page'     => $reservations->perPage(),
                'last_page'    => $reservations->lastPage(),
                'next_page_url'=> $reservations->nextPageUrl(),
                'prev_page_url'=> $reservations->previousPageUrl(),
            ],
        ]);
    }
    /**
     * Rezervasyonu onayla (status = confirmed)
     */
    public function confirmed(int $id): JsonResponse
    {
        // Rezervasyonu bul
        $reservation = Reservation::findOrFail($id);

        // Zaten onaylıysa hata döndür
        if ($reservation->status === ReservationStatus::CONFIRMED->value) {
            return $this->errorResponse('Rezervasyon zaten onaylanmış.', 409);
        }

        // 🟢 Status alanını değiştir
        $reservation->status = ReservationStatus::CONFIRMED->value;

        // 💥 Save kullanıyoruz ki observer tetiklensin
        $reservation->save();

        return $this->successResponse(new ReservationResource($reservation));
    }

    public function canceled(int $id): JsonResponse
    {
        // Rezervasyonu bul
        $reservation = Reservation::findOrFail($id);

        // Zaten iptal edilmişse hata döndür
        if ($reservation->status === ReservationStatus::CANCELED->value) {
            return $this->errorResponse('Rezervasyon zaten reddedilmiş.', 409);
        }

        // 🛑 Status'u canceled yap
        $reservation->status = ReservationStatus::CANCELED->value;

        // 💥 Save kullanıyoruz ki observer tetiklensin
        $reservation->save();

        return $this->successResponse(new ReservationResource($reservation));
    }

    public function search(SearchReservationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $reservation = $this->reservRepo
            ->findByCodeAndPhone($data['code'], $data['phone']);

        if (! $reservation) {
            return $this->errorResponse(
                'Rezervasyon bulunamadı veya telefon numarası hatalı.',
                404
            );
        }

        return $this->successResponse(
            new MusteriReservationResource($reservation)
        );
    }
    public function storeManual(Request $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $data = $request->all();

            // 🧠 postSlug varsa, ID'ye çevirelim
            if (isset($data['postSlug'])) {
                $post = Post::where('slug', $data['postSlug'])->firstOrFail();
                $data['post_id'] = $post->id;
            }

            // 💥 Artık slug değil, gerçek ID ile işlem yapılacak
            $result = $this->reservationService->createManual($data);

            return $this->createdResponse(new ManuelReservationResource($result));
        });
    }

    public function storeExternal(Request $request)
    {
        // ⚠️ Validasyon
        $validator = Validator::make($request->all(), [
            'postSlug' => 'required|string|exists:posts,slug',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'note' => 'required|string',
            'admin_note' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // 🎯 İşlem servise aktar
        $reservation = $this->reservationService->createExternal($request->all());

        return response()->json([
            'success' => true,
            'reservation' => $reservation
        ]);
    }

    public function pendingCount(): JsonResponse
    {
        $user = auth()->user();

        $count = Reservation::query()
            ->where('status', \App\Enums\ReservationStatus::PENDING->value)
            ->byUserRole($user)
            ->count();

        return response()->json(['count' => $count]);
    }
}
