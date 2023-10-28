Sir/Madam,<br>
{{$user['surname'] . " " . $user['initials']}},<br><br>

@if ($action == 'CREATED')
    A new faculty was added to the system. Following are some details related to the evidence.<br>
@elseif ($action == 'UPDATE')
    Deatails about a faculty has been updated. Following are some details related to the changes that were made.<br>
@endif

Faculty details:<br>
    Faculty name: {{$faculty->name}}<br>
    University name: {{$university->name}}<br>
    Faculty address: {{$faculty->address}}<br>
    Faculty contact information: {{json_decode($faculty->contact_no)}}<br>

You can find more details regarding this on our platform. <br>
Thank you.<br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
