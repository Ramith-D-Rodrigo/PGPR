Sir/Madam,<br>
{{ $user['surname'] . ' ' . $user['initials'] }},<br><br>

We are emailing you to inform that,
@if ($action == 'CREATED')
    new post graduate program review application has been created.
@elseif ($action == 'UPDATED')
    details associated with a postgraduate program review application has been updated.
@elseif ($action == 'SUMBITTED_FOR_CQA_DIR_APPROVAL')
    a postgraduate program review application was submitted for your approval.
@elseif ($action == 'SUBMITTED_TO_QAC')
    a postgraduate program application was submitted to the quality assurance council for consideration.
@elseif ($action == 'APPROVED_BY_QAC_OFFICER')
    the postgraduate program review application was approved by the quality assurance coucil.
@endif

The following are some details related to the application.<br>
<br>

Postgraduate program: {{ $postGraduateProgram['title'] }}<br>
University: {{ $university['name'] }}<br>
Faculty: {{ $faculty['name'] }}<br>
<br>

You can visit our platform for more details.<br>
Thank you.<br><br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
