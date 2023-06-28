<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternalQualityAssuranceUnit extends Model
{
  use HasFactory;

  // Internal Quality Assurance Unit has a director
  public function internalQualityAssuranceUnitDirector()
  {
    return $this->hasOne(InternalQualityAssuranceUnitDirector::class);
  }
}
