<?php

namespace App\Modules\Faq\Services;

use App\Modules\Faq\Repositories\FaqRepository;

class FaqService
{
    protected $faqRepository;

    public function __construct(FaqRepository $faqRepository)
    {
        $this->faqRepository = $faqRepository;
    }

    public function all()
    {
        return $this->faqRepository->all();
    }

    public function create(array $data)
    {
        return $this->faqRepository->create($data);
    }

    public function find($id)
    {
        return $this->faqRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->faqRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->faqRepository->delete($id);
    }
}