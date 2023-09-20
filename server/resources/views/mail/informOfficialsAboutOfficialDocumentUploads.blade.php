@component('mail::message')
    Sir/Madam,<br>
    {{$recipient['surname'] . " " . $recipient['initials']}},<br><br>

    @if ($type == 'FINAL')
        We are pleased to inform you that the compilation of the final report has been completed.<br>
    @elseif ($type == 'PRELIMINARY')
        We are pleased to inform you that the compilation of the preliminary report has been completed.<br>
        Make sure to review this document carefully and contact the authorities for any further clarifications.<br>
    @endif

    For the following post-graduate program review.<br>

    Post-graduate program: {{$pgp['title']}}<br>
    University: {{$pgp['name']}}<br>
    Faculty: {{$pgp['name']}}<br>

    You can visit our platform to download the relevant pdfs if needed.<br>
    We appreciate your patience and cooperation during this process. If you have any questions or need further information, please feel free to contact us.<br>

    Thank you.<br><br>

    Regards,<br>
    Postgraduate Programme Review System,<br>
    Quality Assurance Council
@endcomponent
