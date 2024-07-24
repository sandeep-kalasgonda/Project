$(document).ready(function() {
    fetchAppointments();

    $('#appointmentForm').on('submit', function(e) {
        e.preventDefault();

        const appointment = {
            customerName: $('#customerName').val(),
            appointmentDate: $('#appointmentDate').val(),
            description: $('#description').val()
        };

        $.ajax({
            url: '/appointments',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(appointment),
            success: function() {
                fetchAppointments();
            }
        });
    });

    function fetchAppointments() {
        $.ajax({
            url: '/appointments',
            method: 'GET',
            success: function(appointments) {
                $('#appointmentTableBody').empty();
                appointments.forEach(appointment => {
                    $('#appointmentTableBody').append(`
                        <tr>
                            <td>${appointment.id}</td>
                            <td>${appointment.customerName}</td>
                            <td>${appointment.appointmentDate}</td>
                            <td>${appointment.description}</td>
                            <td>
                                <button class="btn btn-danger delete-btn" data-id="${appointment.id}">Delete</button>
                            </td>
                        </tr>
                    `);
                });

                $('.delete-btn').on('click', function() {
                    const id = $(this).data('id');
                    $.ajax({
                        url: `/appointments/${id}`,
                        method: 'DELETE',
                        success: function() {
                            fetchAppointments();
                        }
                    });
                });
            }
        });
    }
});
