<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternalQualityAssuranceUnit extends Model
{
  use HasFactory;

  protected $fillable = [
    'address',
    'contact_no',
    'fax_no',
    'email',
    'iqau_dir_id',
    'faculty_id',
  ];

  // Internal Quality Assurance Unit has a director
  // since both sides are total in participation
  // belongs to is used
  public function internalQualityAssuranceUnitDirector()
  {
    return $this->belongsTo(InternalQualityAssuranceUnitDirector::class, 'iqau_dir_id', 'id');
  }

  // Internal Quality Assurance Unit has a faculty
    public function faculty(){
        return $this->belongsTo(Faculty::class, 'faculty_id', 'id');
    }
}
