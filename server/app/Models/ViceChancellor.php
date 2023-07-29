<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UniversitySide;

class ViceChancellor extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointed_date',
        'term_date',
        'vc_status',
    ];

    //vice chancellor is a university side
    public function universitySide()
    {
        return $this->belongsTo(UniversitySide::class, 'university_id', 'id');
    }

    //vice chancellor approves many self evaluation reports
    public function selfEvaluationReports()
    {
        return $this->hasMany(SelfEvaluationReport::class, 'vice_chancellor_id');
    }

    public function university()
    {
        return $this->belongsTo(University::class, 'vice_chancellor_id', 'id');
    }
}
