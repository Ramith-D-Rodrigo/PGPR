Sir/Madam,<br>
{{$recipient['surname'] . " " . $recipient['initials']}},<br><br>

@if ($remark != NULL || $remark != "")
    The following user has rejected his/her appointment as a reviewer, with the following comment.<br>
    Email: {{$rejected_user['official_email']}}<br>
    Name: {{$rejected_user['full_name']}}<br>
    Comment: {{$remark}}.<br>
@else
    The following user has rejected his/her appointment as a reviewer.<br>
    Email: {{$rejected_user['official_email']}}<br>
    Name: {{$rejected_user['full_name']}}<br>
@endif

Please be kind enough to make follow-up calls to make sure that this was intentional.<br>
If this happened due to a mistake you can make amends using the options provided on our website.<br><br>

Thank you.<br><br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
