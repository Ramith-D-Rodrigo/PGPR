Sir/Madam,<br>
{{$user['surname'] . " " . $user['initials']}},<br><br>

@if ($action == 'CREATED')
    A new postgraduate study program was added to the system. Following are some details related to the postgraduate study program.<br>
@elseif ($action == 'UPDATED')
    Details about a postgraduate study program has been updated. Following are some details related to the changes that were made.<br>
@endif
<br>

Postgraduate study program details:<br><br>
    Faculty name: {{$faculty->name}}<br>
    University name: {{$university->name}}<br>
    Postgraduate study program name: {{$postGraduateProgram->title}}<br>
    SLQF level: {{$postGraduateProgram->slqf_level}}<br>

<br>

You can find more details regarding this on our platform. <br>
Thank you.<br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
