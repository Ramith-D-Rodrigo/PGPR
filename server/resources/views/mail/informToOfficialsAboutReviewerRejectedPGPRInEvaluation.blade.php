Sir/Madam,<br>
{{$recipient['surname'] . " " . $recipient['initials']}},<br><br>

We are unfortunate to inform you that the requested post-graduate program review {{$data['postGraduateProgram']}} has been rejected.<br>
The review team provided the following comments as reasons for rejecting the post-graduate program<br>
that you have submitted.

<hr>
@foreach ($data['reviewers'] as $reviewer)
    &ensp; Name: {{$reviewer['$reviewer']['full_name']}}<br>
    &ensp; Official Email: {{$reviewer['$reviewer']['official_email']}}<br>
    &ensp; : {{$reviewer['comment']}}<br>
<hr>
@endforeach

The review has been rejected by the review team due to the above-mentioned reasons.<br>
If this happened due to some misunderstanding, we suggest that you contact the authorities<br>
mentioned in here and further following up on this issue. <br><br>

Thank you.<br><br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
