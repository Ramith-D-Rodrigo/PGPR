<?php

namespace App\Http\Requests\V1;

use App\Models\Faculty;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreInternalQualityAssuranceUnitDirectorRequest extends StoreQualityAssuranceStaffRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //only cqa director can store iqau director (role is already authorized from the middleware)
        //check for same university side
        $uniSide = Auth::user() -> universitySide ?? null;

        if($uniSide === null){
            return false;
        }

        if($uniSide -> university_id != $this -> university_id) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $parentRules = parent::rules();

        $parentRules['iqau_id'] = ['required', 'exists:internal_quality_assurance_units,id'];

        return $parentRules;
    }

    public function messages(): array {
        $parentMsgs = parent::messages();

        $currMessages = [
            'iqau_id.required' => 'Internal quality assurance unit ID is required',
            'iqau_id.exists' => 'Internal quality assurance unit ID does not exist'
        ];

        return array_merge($parentMsgs, $currMessages);
    }

    public function prepareForValidation() {
        parent::prepareForValidation();

        //add the iqau id by finding the iqau of the faculty id
        $faculty = Faculty::findOrFail($this -> faculty_id);
        $this -> merge([
            'iqau_id' => $faculty -> internalQualityAssuranceUnit -> id
        ]);
    }

}
