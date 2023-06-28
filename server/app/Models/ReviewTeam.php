<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewTeam extends Model
{
    use HasFactory;


    //review team has many reviewers and reviewers belong to many review teams (many-to-many relationship)
    public function reviewers(){
        return $this -> belongsToMany(Reviewer::class, 'reviewer_review_team');
    }
}
