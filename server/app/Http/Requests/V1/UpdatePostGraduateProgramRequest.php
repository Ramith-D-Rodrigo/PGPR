<?php

namespace App\Http\Requests\V1;

use App\Models\ProgrammeCoordinator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UpdatePostGraduateProgramRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'commencement_year' => ['sometimes', 'required', 'integer', 'min:1900', 'max:'.(date('Y')+1)],
            'is_professional_pg_programme' => ['sometimes', 'required', 'boolean'],
            'slqf_level' => ['sometimes', 'required', 'integer', 'min:5', 'max:12'],
            //programme coordinator is not updated here
        ];
    }

    public function prepareForValidation(): void {
        $arr = $this -> all();

        $newArr = [];

        foreach($arr as $key => $value){
            //convert camel to snake
            $newArr[Str::snake($key)] = $value;

            //trim the title
            if($key === 'title'){
                $newArr['title'] = trim($value);
            }
        }

        $this -> replace($newArr);
    }
}
