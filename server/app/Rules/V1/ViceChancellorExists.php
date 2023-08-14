<?php

namespace App\Rules\V1;

use App\Models\University;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ViceChancellorExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        if($value != NULL){
            //found a vice chancellor
            //so cannot create another one
            $fail('There is a vice chancellor registered to this university.');
        }
    }
}
