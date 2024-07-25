$(document).ready(function() {
    // Fetch all appointments on page load
    fetchAppointments();
  
    // Handle form submission for adding new appointment
    $('#appointmentForm').on('submit', function(e) {
      e.preventDefault();
  
      const appointment = {
        customerName: $('#customerName').val(),
        appointmentDate: $('#appointmentDate').val(),
        description: $('#description').val()
      };
  
      axios.post('/appointments', appointment)
        .then(() => {
          $('#successMessage').show();
          fetchAppointments();
          $('#customerName').val('');
          $('#appointmentDate').val('');
          $('#description').val('');
        })
        .catch(error => console.error('Error adding appointment:', error));
    });
  
    // Handle filter button click
    $('#filterButton').on('click', function() {
      const filterDate = $('#filterDate').val();
      if (filterDate) {
        fetchAppointments(filterDate);
      } else {
        alert('Please select a date to filter.');
      }
    });
  
    // Function to fetch appointments
    function fetchAppointments(filterDate = '') {
      let url = '/appointments';
      if (filterDate) {
        url += `/filter?date=${encodeURIComponent(filterDate)}`;
      }
  
      axios.get(url)
        .then(response => {
          const appointments = response.data;
          $('#appointmentTableBody').empty();
          let appointmentCount = 0;
  
          appointments.forEach(appointment => {
            $('#appointmentTableBody').append(`
              <tr>
                <td>${appointment.id}</td>
                <td>${appointment.customerName}</td>
                <td>${appointment.appointmentDate}</td>
                <td>${appointment.description}</td>
                <td>
                  <button class="btn btn-danger delete-btn" data-id="${appointment.id}">Delete</button>
                  <button class="btn btn-info edit-btn" data-id="${appointment.id}">Edit</button>
                </td>
              </tr>
            `);
            appointmentCount++;
          });
  
          $('#appointmentCount').text(`Number of appointments on ${filterDate}: ${appointmentCount}`);
        })
        .catch(error => console.error('Error fetching appointments:', error));
    }
  
    // Handle delete button click
    $(document).on('click', '.delete-btn', function() {
      const id = $(this).data('id');
      axios.delete(`/appointments/${id}`)
        .then(() => fetchAppointments())
        .catch(error => console.error('Error deleting appointment:', error));
    });
  
    // Handle edit button click (show modal and populate fields)
    $(document).on('click', '.edit-btn', function() {
      const id = $(this).data('id');
      axios.get(`/appointments/${id}`)
        .then(response => {
          const appointment = response.data;
          $('#editCustomerName').val(appointment.customerName);
          $('#editAppointmentDate').val(appointment.appointmentDate);
          $('#editDescription').val(appointment.description);
          $('#editAppointmentForm').data('id', id);
          $('#editAppointmentModal').modal('show');
        })
        .catch(error => console.error('Error fetching appointment for edit:', error));
    });
  
    // Handle form submission for editing an appointment
    $('#editAppointmentForm').on('submit', function(e) {
      e.preventDefault();
  
      const id = $(this).data('id');
      const appointment = {
        customerName: $('#editCustomerName').val(),
        appointmentDate: $('#editAppointmentDate').val(),
        description: $('#editDescription').val()
      };
  
      axios.put(`/appointments/${id}`, appointment)
        .then(() => {
          $('#editAppointmentModal').modal('hide');
          fetchAppointments();
        })
        .catch(error => console.error('Error updating appointment:', error));
    });
  });
  