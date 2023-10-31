Sir/Madam,<br>
{{$user['surname'] . " " . $user['initials']}},<br><br>

@if ($action == 'CREATED')
    A new faculty was added to the system. Following are some details related to the evidence.<br>
@elseif ($action == 'UPDATED')
    Deatails about a faculty has been updated. Following are some details related to the changes that were made.<br>
@endif

Faculty details:<br>
    Faculty name: {{$facultyInfo->name}}<br>
    University name: {{$university->name}}<br>
    Faculty address: {{$facultyInfo->address}}<br>
    Faculty contact information:
        @foreach (json_decode($facultyInfo -> contact_no, true)['data'] as $contactInfo)
            {{$contactInfo}}<br>
        @endforeach

    <br>

You can find more details regarding this on our platform. <br>
Thank you.<br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
