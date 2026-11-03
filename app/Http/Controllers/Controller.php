<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpFoundation\Response;

abstract class Controller
{
    /**
     * Başarılı bir JSON yanıtı döndür.
     */
    protected function successResponse($data, int $status = Response::HTTP_OK)
    {
        return response()->json([
            'success' => true,
            'data' => $data,
        ], $status);
    }

    /**
     * Hata mesajı döndür.
     */
    protected function errorResponse(string $message, int $status = Response::HTTP_BAD_REQUEST, $errors = null)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    /**
     * Kaynak bulunamadı mesajı döndür.
     */
    protected function notFoundResponse(string $message = 'Resource not found')
    {
        return $this->errorResponse($message, Response::HTTP_NOT_FOUND);
    }

    /**
     * Yetkilendirme hatası döndür.
     */
    protected function unauthorizedResponse(string $message = 'Unauthorized')
    {
        return $this->errorResponse($message, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Doğrulama hatası döndür.
     */
    protected function validationErrorResponse($errors, string $message = 'Validation errors occurred')
    {
        return $this->errorResponse($message, Response::HTTP_UNPROCESSABLE_ENTITY, $errors);
    }

    /**
     * Oluşturma başarılı yanıtı döndür.
     */
    protected function createdResponse($data)
    {
        return $this->successResponse($data,Response::HTTP_CREATED);
    }

    /**
     * Güncelleme başarılı yanıtı döndür.
     */
    protected function updatedResponse($data)
    {
        return $this->successResponse($data,Response::HTTP_OK);
    }

    /**
     * Silme başarılı yanıtı döndür.
     */
    protected function deletedResponse()
    {
        return $this->successResponse(null,Response::HTTP_NO_CONTENT);
    }

    /**
     * Başka bir işlem gerektiğinde yönlendirme mesajı döndür.
     */
    protected function redirectResponse(string $url)
    {
        return response()->json([
            'success' => true,
            'redirect_url' => $url,
        ], Response::HTTP_OK);
    }
}
