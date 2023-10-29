<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UniversitySide;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ViceChancellor extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointed_date',
        'term_date',
        'vc_status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }

    //vice chancellor is a university side
    public function universitySide()
    {
        return $this->belongsTo(UniversitySide::class, 'id', 'id');
    }

    //vice chancellor approves many self evaluation reports
    public function selfEvaluationReports()
    {
        return $this->hasMany(SelfEvaluationReport::class, 'vice_chancellor_id');
    }

  //vice chancellor has a university
    public function university()
    {
        return $this->belongsTo(University::class, 'university_id', 'id');
    }
}
