<?php

namespace App\Http\Requests\V1;

use App\Models\Standard;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class StoreAdherenceToSERStandard extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //only allow programme coordinator to store adherence to standard (role is checked from the middleware)
        //only need to check whether these roles belong to the particular post graduate program review
        $user = Auth::user();

        //get the ser from the request to find the faculty id
        $SER = $this->route('selfEvaluationReport');

        //check the pgp coordinator id
        if ($user->id == $SER -> pgp_coordinator_id ?? null) {
            return true;
        }
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        //standard id is required and that standard must be applicable to the slqf level of the post graduate program review
        $applicableSLQFLevels = Standard::findOrFail($this->standard_id)->valid_slqf_levels;
        $applicableSLQFLevels = json_decode($applicableSLQFLevels);

        if(in_array("all", $applicableSLQFLevels)){ //if has all, then all slqf levels are applicable
            $applicableSLQFLevels = [7,8,9,10,11,12];
        }
        else{
            $applicableSLQFLevels = array_map('intval', $applicableSLQFLevels);
        }

        return [
            'standard_id' => ['required', 'exists:standards,id'],
            'slqf_level' => ['required', 'in:'.implode(',', $applicableSLQFLevels)],
            'adherence' => ['required', 'string', 'max:1000'],
        ];
    }

    public function prepareForValidation(){
        $PGPRSLQFLevel = $this->route('selfEvaluationReport')->postGraduateProgramReview->postGraduateProgram->slqf_level;

        //convert camel case to snake case
        $reqValues = $this->all();

        $newArr = [];
        foreach($reqValues as $key => $value){
            $newArr[Str::snake($key)] = $value;
        }

        $this -> replace($newArr);

        $this -> merge(['slqf_level' => $PGPRSLQFLevel]);
    }
}
