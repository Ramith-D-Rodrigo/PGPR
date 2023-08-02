<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'full_name',
        'initials',
        'surname',
        'roles',
        'contact_no',
        'profile_pic',
        'official_telephone_no',
        'nic',
        'gender',
        'official_email',
        'personal_email',
        'password',
        'email_verified_at',
        'created_by',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    //there is one user that is a university side
    public function universitySide(){
        return $this -> hasOne(UniversitySide::class, 'id', 'id');
    }

    //there is one user that is a quality assurance council officer
    public function qualityAssuranceCouncilOfficer(){
        return $this -> hasOne(QualityAssuranceCouncilOfficer::class, 'id', 'id');
    }

    //the user may be a cqa director through a quality assurance council officer
    public function qualityAssuranceCouncilDirector(){
        return $this -> hasOneThrough(QualityAssuranceCouncilDirector::class, QualityAssuranceCouncilOfficer::class, 'id', 'id', 'id', 'id');
    }

/*   user account is created by some other user
    following are the scenarios of the different types of users.
        qac officer create accounts for cqa director,vice chancellor and reviewer )
        (cqa director create accounts for dean, programme coordinator, iqau director ) */

    public function createdAccounts(){
        return $this -> hasMany(User::class, 'created_by', 'id');
    }

    public function accountCreatedBy(){
        return $this -> belongsTo(User::class, 'created_by', 'id');
    }
}
