Sir/Madam {{$dean['full_name']}},<br><br>

The following reviewers were appointed by the Quality Assurance for the {{$postGraduateProgram['title']}} postgraduate program review.
<br>
And we expect your feedback regarding the appointments of this review team.<br>

Postgraduate Program: {{$postGraduateProgram['title']}}<br>
Review Team:<br>

<table border="2px">
    <tr>
        <th>Reviewer Name</th>
        <th>Assigned Position</th>
    </tr>

    @foreach($reviewers as $reviewer)
        <tr>
            <td>{{$reviewer->full_name}}</td>
            <td>{{ $reviewer->position == "CHAIR" ? "Chair person" : "Member" }}of the review team</td>
        </tr>
    @endforeach
</table>

You can use the provided user interface options on our website to provide the feedback and the comments that you want.
<br>

Thank You.<br><br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
