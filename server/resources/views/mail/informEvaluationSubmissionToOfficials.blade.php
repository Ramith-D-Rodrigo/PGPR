Sir/Madam,<br>
{{$recipient['surname'] . " " . $recipient['initials']}},<br><br>

We are happy to inform you that the evaluations of the {{$pgp->title}} has been concluded.<br>
Following are the summary details of the review evaluation.<br>

<br>
<hr>
Post-graduate degree program: {{$pgp->title}}<br>
University: {{$pgp->title}}<br>
Faculty: {{$pgp->title}}<br>
Grade obtained in the stage: "{{$data['overallPerformanceOfStudyScore']}}"<br>
Number of criteria with a score less than minimum criterion score: "{{$data['numberOfCriteriaLessThanMinimumCriteriaScore']}}"
<br>
Evaluation summary : <br>

<table style="margin: 1px;">
    <thead>
    <tr>
        <th>Criteria Name</th>
        <th>Raw Criterion Score</th>
        <th>Actual Criterion Score</th>
        <th>Maximum Criterion Score</th>
        <th>Minimum Criterion Score</th>
    </tr>
    </thead>
    <tbody>
    @foreach ($data['scores'] as $score)
        <tr>
            <td>{{ $score['criterionName'] }}</td>
            <td>{{ $score['rawCriterionScore'] }}</td>
            <td>{{ $score['actualCriterionScore'] }}</td>
            <td>{{ $score['maximumCriterionScore'] }}</td>
            <td>{{ $score['minimumCriterionScore'] }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<br>
<hr>
<br>
You can further follow up on this on out platform.<br>
Thank you.<br><br>

Regards,<br>
Postgraduate Programme Review System,<br>
Quality Assurance Council
