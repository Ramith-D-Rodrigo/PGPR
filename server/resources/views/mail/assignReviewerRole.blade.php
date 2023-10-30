Hello {{$user['surname'] . " " . $user['initials']}},<br><br>

You have been assigned as a reviewer for the postgradute programme review.<br>
Please note that you have other roles in the system as well.<br>

You have currently have access to following roles.<br>

<ul>
    @php
        $roles = json_decode($user['roles'], true);
    @endphp
    @foreach($roles as $role)
        <li>{{$role}}</li>
    @endforeach
</ul>

You can use your same credentials to login to the system.<br><br>
Remember to specify the role you want to login with.<br><br>
At the initial login in reviewer role, you will be asked to upload the appointment letter.<br><br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
