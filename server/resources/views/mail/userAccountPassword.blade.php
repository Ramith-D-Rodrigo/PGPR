Hello {{$user['surname'] . " " . $user['initials']}},<br><br>

This is an email from the Postgraduate Programme Review System.<br>
An account has been created for you in the system to manage the postgraduate programme review related tasks.<br>
Please use the following credentials to login to the system.<br><br>

Email: {{$user['official_email']}}<br>
Password: {{$user['password']}}<br><br>

This password is temporary and you will be asked to change it on your first login.<br><br>

You have currently have access to following roles.<br>
@foreach($user['roles'] as $role)
    {{$role}}<br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
