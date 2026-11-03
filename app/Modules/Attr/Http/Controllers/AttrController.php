<?php

namespace App\Modules\Attr\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Attr\Http\Requests\PostHasAttrRequest;
use App\Modules\Attr\Services\AttrService;
use App\Modules\Attr\Http\Requests\AttrRequest;
use App\Modules\Attr\Http\Resources\AttrResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class AttrController extends Controller
{
    use HandlesApiExceptions;

    protected $attrService;

    public function __construct(AttrService $attrService)
    {
        $this->attrService = $attrService;
    }

    public function index(): JsonResponse
    {
        $data = $this->attrService->all();
        return $this->successResponse(AttrResource::collection($data));
    }


    public function store(AttrRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $attr = $this->attrService->create($validatedData);
            return $this->createdResponse($attr);
        });
    }

    public function show($slug): JsonResponse
    {
        $data = $this->attrService->find($slug);
        return $this->successResponse(new AttrResource($data));
    }

    public function update(AttrRequest $request, $slug): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($slug, $request) {
            $validatedData = $request->validated();
            $attr = $this->attrService->update($slug, $validatedData);
            return $this->updatedResponse($attr);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->attrService->delete($id);
        return $this->deletedResponse();
        });
    }

    //attr_type a göre listeleme örnek = rules,features gibi
    public function getByType($type): JsonResponse
    {
        // 🔥 İlişkili model 'infoRelation' ile birlikte çekiyoruz
        $data = $this->attrService->getByType($type, ['infoRelation']);

        // ✅ AttrResource ile formatlayıp dönüyoruz
        return $this->successResponse(AttrResource::collection($data));
    }


    //post_type a göre listeleme örnek = villa,bungalov gibi
    public function getByPostType($postType): JsonResponse
    {
        $data = $this->attrService->getByPostType($postType);
        return $this->successResponse(AttrResource::collection($data));
    }

    public function getByPostTypeAndAttrType(PostHasAttrRequest $request)
    {
        $validated = $request->validated();

        // debug bittiyse aşağıdaki iki satırı sil:
        // return response()->json($validated);

        $data = $this->attrService
            ->getByPostTypeAndAttrType(
                $validated['post_type'],
                $validated['attr_type']
            );

        return $this->successResponse(
            AttrResource::collection($data)
        );
    }

}
