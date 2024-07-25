document.addEventListener("DOMContentLoaded", function() {
    const appointmentForm = document.getElementById('appointmentForm');
    const filterButton = document.getElementById('filterButton');
    const appointmentTableBody = document.getElementById('appointmentTableBody');
    const appointmentCount = document.getElementById('appointmentCount');
    const successMessage = document.getElementById('successMessage');

    // Load all appointments initially
    fetchAppointments();

    appointmentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const customerName = document.getElementById('customerName').value;
        const appointmentDate = document.getElementById('appointmentDate').value;
        const description = document.getElementById('description').value;

        axios.post('/appointments', {
            customerName,
            appointmentDate,
            description
        })
        .then(response => {
            successMessage.style.display = 'block';
            fetchAppointments();  // Refresh the list
            appointmentForm.reset();
        })
        .catch(error => {
            console.error('There was an error adding the appointment!', error);
        });
    });

    filterButton.addEventListener('click', function() {
        const filterDate = document.getElementById('filterDate').value;

        axios.get(`/appointments/filter?date=${filterDate}`)
        .then(response => {
            const appointments = response.data;
            updateAppointmentTable(appointments);
        })
        .catch(error => {
            console.error('There was an error filtering the appointments!', error);
        });
    });

    function fetchAppointments() {
        axios.get('/appointments')
        .then(response => {
            const appointments = response.data;
            updateAppointmentTable(appointments);
        })
        .catch(error => {
            console.error('There was an error fetching the appointments!', error);
        });
    }

    function updateAppointmentTable(appointments) {
        appointmentTableBody.innerHTML = '';
        appointments.forEach(appointment => {
            const row = `<tr>
                <td>${appointment.id}</td>
                <td>${appointment.customerName}</td>
                <td>${appointment.appointmentDate}</td>
                <td>${appointment.description}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="editAppointment(${appointment.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAppointment(${appointment.id})">Delete</button>
                </td>
            </tr>`;
            appointmentTableBody.innerHTML += row;
        });
        appointmentCount.innerText = `Total appointments: ${appointments.length}`;
    }

    window.editAppointment = function(id) {
        axios.get(`/appointments/${id}`)
        .then(response => {
            const appointment = response.data;
            document.getElementById('editAppointmentId').value = appointment.id;
            document.getElementById('editCustomerName').value = appointment.customerName;
            document.getElementById('editAppointmentDate').value = appointment.appointmentDate;
            document.getElementById('editDescription').value = appointment.description;
            $('#editAppointmentModal').modal('show');
        })
        .catch(error => {
            console.error('There was an error fetching the appointment details!', error);
        });
    }

    document.getElementById('editAppointmentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const id = document.getElementById('editAppointmentId').value;
        const customerName = document.getElementById('editCustomerName').value;
        const appointmentDate = document.getElementById('editAppointmentDate').value;
        const description = document.getElementById('editDescription').value;

        axios.put(`/appointments/${id}`, {
            customerName,
            appointmentDate,
            description
        })
        .then(response => {
            $('#editAppointmentModal').modal('hide');
            fetchAppointments();  // Refresh the list
        })
        .catch(error => {
            console.error('There was an error updating the appointment!', error);
        });
    });

    window.deleteAppointment = function(id) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            axios.delete(`/appointments/${id}`)
            .then(() => {
                fetchAppointments();  // Refresh the list
            })
            .catch(error => {
                console.error('There was an error deleting the appointment!', error);
            });
        }
    }
});
