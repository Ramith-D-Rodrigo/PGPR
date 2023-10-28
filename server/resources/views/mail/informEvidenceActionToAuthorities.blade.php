Sir/Madam,<br>
{{$user['surname'] . " " . $user['initials']}},<br><br>

@if ($action == 'UPLOAD')
    New evidence has been uploaded to our servers. Following are some details related to the evidence.<br>
@elseif ($action == 'UPDATE')
    Existing evidence has been update. Following are some details related to the evidence.<br>
@elseif ($action == 'DELETE')
    The below-mentioned evidences were deleted from our servers recently.<br>
@endif

Postgraduate program details:<br>
    Postgraduate program name: {{$postgraduateProgram->title}}<br>

Evidence details:<br>
    Evidence name: {{$evidence->evidence_name}}<br>
    Evidence code: {{$evidence->evidence_code}}<br>
    Evidence applicable years: {{json_decode($evidence->applicable_years)}}<br>

You can find more details regarding this on our platform. <br>
Thank you.<br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
