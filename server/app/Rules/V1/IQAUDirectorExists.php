<?php

namespace App\Rules\V1;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class IQAUDirectorExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //check if the center for quality assurance director exists
        if($value != NULL){
            //found a center for quality assurance director
            //so cannot create another one
            $fail('There is a center for internal quality assurance unit director registered to this IQAU.');
        }
    }
}
