<?php

namespace App\Modules\Comment\Repositories;

use App\Modules\Comment\Models\Comment;
use Illuminate\Database\Eloquent\Collection;
class CommentRepository
{
    public function all()
    {
        return Comment::all();
    }

    public function paginate($perPage = 15)
    {
        return Comment::paginate($perPage);
    }

    public function find($id)
    {
        return Comment::findOrFail($id);
    }
    // Yorum id ile bulma
    public function findById($id)
    {
        return Comment::find($id);
    }

    public function create(array $data)
    {
        // Kullanıcı ID'sini auth'dan alıyoruz
        $userId = auth()->id();

        // Rezervasyon koduna göre rezervasyonu bul
        $reservation = \App\Modules\Reservation\Models\Reservation::where('code', $data['reservation_code'])->first();

        if (!$reservation) {
            throw new \Exception('Geçerli bir rezervasyon kodu girin!');
        }

        // Aynı kullanıcı bu rezervasyona yorum yapmış mı?
        $alreadyCommented = Comment::where('reservation_id', $reservation->id)
            ->where('user_id', $userId)
            ->exists();

        if ($alreadyCommented) {
            throw new \Exception('Bu rezervasyon ile zaten yorum yapmışsınız!');
        }

        // Yorum oluşturuluyor 📝
        return Comment::create([
            'reservation_id' => $reservation->id,
            'post_id' => $reservation->post_id,
            'user_id' => $userId, // artık user_id'yi buradan veriyoruz
            'comment' => $data['comment'],
            'rating' => $data['rating'] ?? 5,
        ]);
    }


    public function update($id, array $data)
    {
        $model = Comment::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = Comment::findOrFail($id);
        return $model->delete();
    }
    public function getCommentsByUser($userId)
    {
        // Kullanıcının ID'sine göre yorumları, user ilişkisiyle birlikte alıyoruz
        return Comment::with('user')
            ->where('user_id', $userId)
            ->get();
    }




    // post_id'ye göre yorumları alma (paginate 15)
    public function getCommentsByPost($postId)
    {
        return Comment::where('post_id', $postId)->paginate(15);
    }

// tüm yorumları getirme (paginate 15)
    public function getAllComments()
    {
        return Comment::paginate(15);
    }

}
