Sir/Madam,<br>
{{$user['surname'] . " " . $user['initials']}},<br><br>

@if ($action == 'REMOVED')
    The following review team was removed from the assigned postgraduate program reviewer.<br>
    The Following are some details related<br>
@elseif ($action == 'UPDATED')
@endif

Details:<br>
&#9;postGraduateProgram name: {{$postGraduateProgram->title}}<br>
&#9;Faculty name: {{$faculty->name}}<br>
&#9;University name: {{$university->name}}<br>
&#9;Reviewers:<br>
@foreach($reviewers as $reviewer)
&#9;&#9;Reviewer name: {{$reviewer->user->full_name}}<br>
&#9;&#9;Reviewer email: {{$reviewer->user->offical_email}}<br>
@endforeach

You can find more details regarding this on our platform. <br>
Thank you.<br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
