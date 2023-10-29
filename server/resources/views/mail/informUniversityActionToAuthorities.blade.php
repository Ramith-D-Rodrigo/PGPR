Sir/Madam,<br>
{{$user['surname'] . " " . $user['initials']}},<br><br>

@if ($action == 'CREATED')
@elseif ($action == 'UPDATED')
    Information related to a university in the systems was updated.<br>
    Following are some details related to the change.<br>
@endif

Details:<br>
&#9;University Name: {{$university->name}}
&#9;University address: {{$university->name}}
&#9;University website: {{$university->website}}

You can find more details regarding this on our platform. <br>
Thank you.<br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
