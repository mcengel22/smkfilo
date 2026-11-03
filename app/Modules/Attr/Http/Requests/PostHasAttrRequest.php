<?php
namespace App\Modules\Attr\Http\Requests;

use App\Enums\AttrType;
use App\Enums\PostType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostHasAttrRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Burada tam olarak rota param ismiyle alıyoruz
        $this->merge([
            'post_type' => $this->route('postType'),
            'attr_type' => $this->route('attrType'),
        ]);
    }

    public function rules(): array
    {
        return [
            'attr_type' => [
                'required', 'string',
                Rule::in(AttrType::getValues()),
            ],
            'post_type' => [
                'required', 'string',
                Rule::in(PostType::getValues()),
            ],
        ];
    }
}
