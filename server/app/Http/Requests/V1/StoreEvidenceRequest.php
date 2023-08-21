<?php

namespace App\Http\Requests\V1;

use App\Models\SelfEvaluationReport;
use App\Models\Standard;
use App\Services\V1\StandardService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class StoreEvidenceRequest extends FormRequest
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
        //find the standard from the request
        $standard = Standard::findOrFail($this->standard_id);
        $applicableSLQFLevels = StandardService::getApplicableSLQFLevels($standard);

        return [
            'self_evaluation_report_id' => ['required', 'exists:self_evaluation_reports,id'],
            'evidence_code' => ['required', 'string', 'max:100'],
            'evidence_name' => ['required', 'string', 'max:100'],
            //applicable years should be from 1 to 5
            'applicable_years' => ['required', 'array', 'min:1', 'max:5'], //array of integers
            'applicable_years.*' => ['required', 'integer', 'min:1', 'max:5'],
            //the url should be a google drive url
            'url' => ['required', 'url'],
            'standard_id' => ['required', 'exists:standards,id'],
            'slqf_level' => ['required', 'integer', 'in:'.implode(',', $applicableSLQFLevels)],
        ];
    }


    public function prepareForValidation() {

        //convert camel case to snake case
        $reqValues = $this->all();
        $newArr = [];
        foreach ($reqValues as $key => $value) {
            $newArr[Str::snake($key)] = $value;
        }
        $this -> replace($newArr);

        //get the ser id and find the applicable slqf levels
        $ser = SelfEvaluationReport::findOrFail($this -> self_evaluation_report_id);
        $PGPRSLQFLevel = $ser -> postGraduateProgramReview -> postGraduateProgram -> slqf_level;

        //store the applicable slqf levels in the request
        $this -> merge([
            'slqf_level' => $PGPRSLQFLevel
        ]);

    }
}
