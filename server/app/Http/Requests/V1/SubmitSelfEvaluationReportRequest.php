<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SubmitSelfEvaluationReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //only programme coordinator of the relevant ser report issuing faculty can submit
        //pgp coordinator role is already checked in the middleware
        $user = Auth::user();
        $SER = $this -> route('selfEvaluationReport');

        //first check whether this SER can be submitted (check the stage of the pgpr)
        $pgpr = $SER -> postGraduateProgramReview;

        if($pgpr -> status_of_pgpr !== 'PLANNING'){
            return false;
        }

        //user authorization check
        $pgpCoorId = $pgpr -> postGraduateProgram -> currentProgrammeCoordinator -> id;

        if($user -> id === $pgpCoorId){
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
        //must have following pdf attachments
        //final_ser_report
        //section_a
        //section_b
        //section_d
        //payment_voucher for the pgpr
        return [
            'final_ser_report' => ['required', 'file', 'mimes:pdf', 'max:10000'],
            'section_a' => ['required', 'file', 'mimes:pdf', 'max:10000'],
            'section_b' => ['required', 'file', 'mimes:pdf', 'max:10000'],
            'section_d' => ['required', 'file', 'mimes:pdf', 'max:10000'],
            'payment_voucher' => ['required', 'file', 'mimes:pdf', 'max:10000'],
        ];
    }

    public function prepareForValidation(): void
    {
        $objProps = $this -> all();

        $replacingArr = [];
        //convert to snake case
        foreach($objProps as $key => $value){
            $replacingArr[Str::snake($key)] = $value;
        }

        $this -> replace($replacingArr);
    }
}
