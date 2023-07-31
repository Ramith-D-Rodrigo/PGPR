<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evidence extends Model
{
    use HasFactory;
    protected $fillable = [
        'evidence_code',
        'evidence_name',
        'applicable_years',
        'url'
    ];

    protected $table = 'evidences';

    public function selfEvaluationReport()
    {
        return $this->belongsToMany(Evidence::class, 'ser_evidence_standard', 'evidence_id', 'ser_id');
    }

    public function standards()
    {
        return $this->belongsToMany(Standard::class, 'ser_evidence_standard', 'evidence_id', 'standard_id');
    }
}
