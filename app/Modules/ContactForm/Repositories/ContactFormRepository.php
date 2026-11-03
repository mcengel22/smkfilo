<?php

namespace App\Modules\ContactForm\Repositories;

use App\Modules\ContactForm\Models\ContactForm;

class ContactFormRepository
{
    public function all()
    {
        return ContactForm::all();
    }

    public function paginate($perPage = 15)
    {
        return ContactForm::paginate($perPage);
    }

    public function find($id)
    {
        return ContactForm::findOrFail($id);
    }

    public function create(array $data)
    {
        return ContactForm::create($data);
    }

    public function update($id, array $data)
    {
        $model = ContactForm::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = ContactForm::findOrFail($id);
        return $model->delete();
    }
}