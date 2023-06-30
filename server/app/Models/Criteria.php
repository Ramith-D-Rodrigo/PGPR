<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    use HasFactory;

    //1 to many relationship between criteria and standards
    public function standards(){
        return $this -> hasMany(Standard::class);
    }

    //many to many relationship between criteria and review team
    public function reviewTeams(){
        return $this -> belongsToMany(ReviewTeam::class, 'review_team_set_criterias', 'criteria_id', 'review_team_id');
    }
}
