Sir/Madam,<br>
{{$user['surname'] . " " . $user['initials']}},<br><br>

@if ($action == 'SUBMITTING_SER_FOR_IQAU_CQA_VC_RECOMMENDATIONS')
    A self-evaluation report was submitted for recommendations. Please refer to the details below.<br>
@elseif ($action == 'UPDATED')
    A self-evaluation report with the following details, was submitted to be recommended.<br>
@endif

Details:<br>
&#9;postGraduateProgram name: {{$postGraduateProgram->title}}<br>
&#9;Faculty name: {{$faculty->name}}<br>
&#9;University name: {{$university->name}}<br>

You can find more details regarding this on our platform. <br>
Thank you.<br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
