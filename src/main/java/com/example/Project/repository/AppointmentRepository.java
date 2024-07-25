package com.example.Project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Project.entity.Appointment;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
  List<Appointment> findByAppointmentDate(LocalDate date);

  List<Appointment> findAllByOrderByAppointmentDate();

  List<Appointment> findAllByOrderByCustomerName();
}
