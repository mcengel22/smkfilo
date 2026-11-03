<?php

namespace App\Modules\ContactForm\Services;

use App\Modules\ContactForm\Repositories\ContactFormRepository;

class ContactFormService
{
    protected $contactFormRepository;

    public function __construct(ContactFormRepository $contactFormRepository)
    {
        $this->contactFormRepository = $contactFormRepository;
    }

    public function all()
    {
        return $this->contactFormRepository->all();
    }

    public function create(array $data)
    {
        return $this->contactFormRepository->create($data);
    }

    public function find($id)
    {
        return $this->contactFormRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->contactFormRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->contactFormRepository->delete($id);
    }
}