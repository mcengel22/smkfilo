<?php

namespace App\Traits;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;

trait HandlesApiExceptions
{
    /**
     * API İstisnalarını Yönetir
     *
     * @param \Closure $callback
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleApiExceptions(\Closure $callback)
    {
        try {
            // Callback fonksiyonunu çalıştır
            return $callback();
        } catch (AuthorizationException $e) {
            // Yetki hatasında dönecek özel mesaj
            return $this->errorResponse('Yetkilendirme başarısız', 403, ['error' => $e->getMessage()]);
        } catch (ModelNotFoundException $e) {
            // Model bulunamadığında dönecek özel mesaj
            return $this->errorResponse('İstenen id bulunamadı',404, ['error' => $e->getMessage()]);
        } catch (HttpException $e) {
            // HTTP hatalarında dönecek özel mesaj ve hata kodu
            return $this->errorResponse($e->getMessage(), $e->getStatusCode(), ['error' => $e->getMessage()]);
        } catch (\Exception $e) {
            // Diğer beklenmedik hatalarda dönecek genel mesaj
            return $this->errorResponse('Beklenmedik bir hata oluştu',500, ['error' => $e->getMessage()]);
        }
    }
}
