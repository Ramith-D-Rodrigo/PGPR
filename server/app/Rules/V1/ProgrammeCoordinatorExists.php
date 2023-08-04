<?php

namespace App\Rules\V1;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ProgrammeCoordinatorExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //check if the programme coordinator exists
        if($value != NULL){
            //found a programme coordinator
            //so cannot create another one
            $fail('There is a programme coordinator registered to this programme.');
        }
    }
}
