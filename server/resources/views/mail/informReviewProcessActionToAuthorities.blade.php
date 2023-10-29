Sir/Madam,<br>
{{$user['surname'] . " " . $user['initials']}},<br><br>

@if ($action == 'COMPLETED')
    We are happy to inform you that the review process of the below mentioned<br>
    postgraduate review program has been completed. You can find the final<br>
    reports on our platform.<br>
@elseif ($action == 'UPDATED')
@endif

Review details:<br>
    postGraduateProgram name: {{$postGraduateProgram->title}}<br>
    Faculty name: {{$faculty->name}}<br>
    University name: {{$university->name}}<br>
    Faculty address: {{$faculty->address}}<br>

You can find more details regarding this on our platform. <br>
Thank you.<br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
