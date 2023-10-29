Sir/Madam,<br>
{{$user['surname'] . " " . $user['initials']}},<br><br>

@if ($action == 'CREATED')
    Proper evaluation of a review has started. Following are some details related to the proper evaluation.<br>
@elseif ($action == 'UPDATED')
    Proper evaluation of a review has been updated. Following are some details related to the proper evaluation.<br>
@endif

Proper Evaluation details:<br>
    Faculty name: {{$faculty->name}}<br>
    University name: {{$university->name}}<br>
    Faculty address: {{$faculty->address}}<br>
    postGraduateProgram name: {{$postGraduateProgram->title}}<br>
    Proper evaluation start date: {{$properEvaluation->start_date}}<br>
    Proper evaluation end date: {{$properEvaluation->end_date}}<br>

You can find more details regarding this on our platform. <br>
Thank you.<br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
