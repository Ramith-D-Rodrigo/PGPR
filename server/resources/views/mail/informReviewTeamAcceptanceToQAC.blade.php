Sir/Madam {{$user['full_name']}},<br><br>

The following reviewers were appointed by the Quality Assurance for the {{$postGraduateProgram['title']}} postgraduate program review.
<br>
And the dean {{$dean['full_name']}} of the faculty {{$faculty['name']}} of {{$university['name']}} has accepted the appointed review team.
<br>

Postgraduate Program: {{$postGraduateProgram['title']}}<br>
Review Team:<br>

<table border="2px">
    <tr>
        <th>Reviewer Name</th>
        <th>Assigned Position</th>
    </tr>

    @foreach($reviewTeam["reviewers"] as $reviewer)
        <tr>
            <td>{{$reviewer->user->full_name}}</td>
            <td>{{ $reviewer->pivot->position == "CHAIR" ? "Chair person" : "Member" }}</td>
        </tr>
    @endforeach
</table>

<br>

@if($reviewTeam->remarks)
    Remark: {{$reviewTeam->remarks}}<br>
    <br>
@endif

You may ask the reviewers to proceed with their work on the review program.<br>

Thank You.<br><br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
