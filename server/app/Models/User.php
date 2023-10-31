<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements CanResetPassword
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

    //user maybe an academic staff member through university side
    public function academicStaff(){
        return $this -> hasOneThrough(AcademicStaff::class, UniversitySide::class, 'id', 'id', 'id', 'id');
    }

    //user maybe a vice chancellor through university side
    public function viceChancellor(){
        return $this -> hasOneThrough(ViceChancellor::class, UniversitySide::class, 'id', 'id', 'id', 'id');
    }

    //user maybe a quality assurance staff through university side
    public function qualityAssuranceStaff(){
        return $this -> hasOneThrough(QualityAssuranceStaff::class, UniversitySide::class, 'id', 'id', 'id', 'id');
    }

    //user maybe a cqa director through univesity side then quality assurance staff
    public function CenterForQualityAssuranceDirector(){
        return $this -> qualityAssuranceStaff() -> centerForQualityAssuranceDirector();
    }

    //user maybe a iqau director through univesity side then quality assurance staff
    public function InternalQualityAssuranceUnitDirector(){
        return $this -> qualityAssuranceStaff() -> internalQualityAssuranceUnitDirector();
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

    public function getEmailForPasswordReset()
    {
        return $this->official_email;
    }

    public function routeNotificationFor($driver)
    {
        if (method_exists($this, $method = 'routeNotificationFor' . Str::studly($driver))) {
            return $this->{$method}();
        }

        switch ($driver) {
            case 'database':
                return $this->notifications();
            case 'mail':
                return $this->official_email;
            case 'nexmo':
                return $this->phone_number;
            default:
                return $this->official_email;
        }
    }
}
