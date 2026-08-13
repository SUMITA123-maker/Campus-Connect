package com.campusconnect.service;

import com.campusconnect.dto.response.CertificateResponse;
import com.campusconnect.entity.Attendance;
import com.campusconnect.entity.Certificate;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.Student;
import com.campusconnect.enums.AttendanceStatus;
import com.campusconnect.enums.CertificateStatus;
import com.campusconnect.enums.EventStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.repository.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public void generateCertificatesForEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        List<Attendance> presentList = attendanceRepository
                .findByEventIdAndStatus(eventId, AttendanceStatus.PRESENT);

        for (Attendance attendance : presentList) {
            Student student = attendance.getStudent();

            if (certificateRepository.existsByStudentIdAndEventId(student.getId(), eventId)) {
                continue;
            }

            String position = resultRepository
                    .findByStudentIdAndEventId(student.getId(), eventId)
                    .map(r -> r.getPosition() != null ? r.getPosition() : "Participant")
                    .orElse("Participant");

            String certNumber = "CC-" + Year.now().getValue()
                    + "-" + String.format("%05d", (long) (Math.random() * 99999));

            String pdfPath;
            try {
                pdfPath = generatePdf(student, event, position, certNumber);
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate certificate for student: " + student.getId(), e);
            }

            Certificate cert = new Certificate();
            cert.setStudent(student);
            cert.setEvent(event);
            cert.setStatus(CertificateStatus.GENERATED);
            cert.setFilePath(pdfPath);
            cert.setCertificateNumber(certNumber);
            cert.setGeneratedAt(LocalDateTime.now());
            certificateRepository.save(cert);
        }
    }

    @Transactional
    public void generateCertificatesForSelectedStudents(Long eventId, List<Long> studentIds, String organizerEmail) {
        Event event = getOrganizerEvent(eventId, organizerEmail);

        if (event.getStatus() != EventStatus.COMPLETED) {
            throw new IllegalArgumentException("Certificates can be generated only after the event is completed");
        }

        if (studentIds == null || studentIds.isEmpty()) {
            throw new IllegalArgumentException("Select at least one student");
        }

        for (Long studentId : studentIds) {
            Attendance attendance = attendanceRepository
                    .findByStudentIdAndEventId(studentId, eventId)
                    .orElseThrow(() -> new IllegalArgumentException("Student has not been marked in attendance: " + studentId));

            if (attendance.getStatus() != AttendanceStatus.PRESENT) {
                throw new IllegalArgumentException("Certificate can be generated only for present students: " + studentId);
            }

            Student student = attendance.getStudent();

            if (certificateRepository.existsByStudentIdAndEventId(student.getId(), eventId)) {
                continue;
            }

            createCertificate(student, event);
        }
    }

    @Transactional
    public CertificateResponse verifyCertificate(Long certId) {
        Certificate cert = certificateRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
        cert.setStatus(CertificateStatus.AVAILABLE_FOR_DOWNLOAD);
        cert.setVerifiedAt(LocalDateTime.now());
        return toResponse(certificateRepository.save(cert));
    }

    @Transactional
    public Resource getCertificateFile(Long certId, String studentEmail) {
        Certificate cert = certificateRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));

        if (!cert.getStudent().getEmail().equals(studentEmail)) {
            throw new UnauthorizedException("This certificate does not belong to you");
        }
        if (cert.getStatus() != CertificateStatus.AVAILABLE_FOR_DOWNLOAD) {
            throw new IllegalArgumentException("Certificate is not yet available for download");
        }

        ensureCertificatePdf(cert);
        return new FileSystemResource(cert.getFilePath());
    }

    @Transactional
    public Resource getOrganizerCertificateFile(Long certId, String organizerEmail) {
        Certificate cert = getOrganizerCertificate(certId, organizerEmail);
        ensureCertificatePdf(cert);
        return new FileSystemResource(cert.getFilePath());
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getCertificatesForStudent(String studentEmail) {
        return certificateRepository.findByStudentEmailAndStatus(studentEmail, CertificateStatus.AVAILABLE_FOR_DOWNLOAD)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getAllCertificatesForEvent(Long eventId) {
        return certificateRepository.findByEventId(eventId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getOrganizerCertificatesForEvent(Long eventId, String organizerEmail) {
        getOrganizerEvent(eventId, organizerEmail);
        return certificateRepository.findByEventId(eventId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private void createCertificate(Student student, Event event) {
        String position = resultRepository
                .findByStudentIdAndEventId(student.getId(), event.getId())
                .map(r -> r.getPosition() != null ? r.getPosition() : "Participant")
                .orElse("Participant");

        String certNumber = "CC-" + Year.now().getValue()
                + "-" + String.format("%05d", (long) (Math.random() * 99999));

        String pdfPath;
        try {
            pdfPath = generatePdf(student, event, position, certNumber);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate certificate for student: " + student.getId(), e);
        }

        Certificate cert = new Certificate();
        cert.setStudent(student);
        cert.setEvent(event);
        cert.setStatus(CertificateStatus.GENERATED);
        cert.setFilePath(pdfPath);
        cert.setCertificateNumber(certNumber);
        cert.setGeneratedAt(LocalDateTime.now());
        certificateRepository.save(cert);
    }

    private Event getOrganizerEvent(Long eventId, String organizerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new UnauthorizedException("You are not the organizer of this event");
        }

        return event;
    }

    private Certificate getOrganizerCertificate(Long certId, String organizerEmail) {
        Certificate cert = certificateRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));

        if (!cert.getEvent().getOrganizer().getEmail().equals(organizerEmail)) {
            throw new UnauthorizedException("You are not the organizer of this event");
        }

        return cert;
    }

    private void ensureCertificatePdf(Certificate cert) {
        if (cert.getCertificateNumber() == null || cert.getCertificateNumber().isBlank()) {
            cert.setCertificateNumber("CC-" + Year.now().getValue()
                    + "-" + String.format("%05d", (long) (Math.random() * 99999)));
        }

        String position = resultRepository
                .findByStudentIdAndEventId(cert.getStudent().getId(), cert.getEvent().getId())
                .map(r -> r.getPosition() != null ? r.getPosition() : "Participant")
                .orElse("Participant");

        try {
            cert.setFilePath(generatePdf(cert.getStudent(), cert.getEvent(), position, cert.getCertificateNumber()));
            certificateRepository.save(cert);
        } catch (Exception e) {
            throw new RuntimeException("Failed to prepare certificate download", e);
        }
    }

    private String generatePdf(Student student, Event event,
                                String position, String certNumber) throws Exception {
        Path certDir = Path.of(uploadDir, "certificates");
        Files.createDirectories(certDir);
        String filePath = certDir.resolve(certNumber + ".pdf").toString();

        Rectangle pageSize = PageSize.A4.rotate();
        Document doc = new Document(pageSize, 70, 70, 44, 44);
        PdfWriter writer = PdfWriter.getInstance(doc, new FileOutputStream(filePath));
        doc.open();

        PdfContentByte canvas = writer.getDirectContent();
        drawCertificateBackground(canvas, pageSize);

        addCenteredLogo(doc, pageSize);

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 38, Font.BOLD, BaseColor.BLACK);
        Font subtitleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.BLACK);
        Font bodyFont = new Font(Font.FontFamily.HELVETICA, 15, Font.NORMAL, BaseColor.BLACK);
        Font nameFont = new Font(Font.FontFamily.HELVETICA, 35, Font.NORMAL, BaseColor.BLACK);
        Font detailsFont = new Font(Font.FontFamily.HELVETICA, 13, Font.NORMAL, BaseColor.BLACK);
        Font certFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.DARK_GRAY);

        Paragraph title = new Paragraph("CERTIFICATE", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(92);
        doc.add(title);

        Paragraph subtitle = new Paragraph("OF PARTICIPATION", subtitleFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingBefore(-8);
        doc.add(subtitle);

        Paragraph awarded = new Paragraph("This certificate is proudly awarded to", bodyFont);
        awarded.setAlignment(Element.ALIGN_CENTER);
        awarded.setSpacingBefore(48);
        doc.add(awarded);

        Paragraph name = new Paragraph(student.getFullName(), nameFont);
        name.setAlignment(Element.ALIGN_CENTER);
        name.setSpacingBefore(20);
        doc.add(name);

        canvas.setColorStroke(BaseColor.BLACK);
        canvas.setLineWidth(1.2f);
        canvas.moveTo(170, 238);
        canvas.lineTo(pageSize.getWidth() - 170, 238);
        canvas.stroke();

        String organizerName = event.getOrganizer() != null ? event.getOrganizer().getFullName() : "Organizer";
        String details = "For his/her participation in " + event.getTitle()
                + ", organized by " + organizerName
                + " dated " + event.getEventDate().toLocalDate() + ".";
        Paragraph detailsPara = new Paragraph(details, detailsFont);
        detailsPara.setAlignment(Element.ALIGN_CENTER);
        detailsPara.setSpacingBefore(10);
        detailsPara.setIndentationLeft(110);
        detailsPara.setIndentationRight(110);
        doc.add(detailsPara);

        drawSignature(canvas, organizerName, "ORGANIZER", 250, 92);
        drawSignature(canvas, "Verified by Admin", "ADMIN", pageSize.getWidth() - 250, 92);

        Phrase certNo = new Phrase("Certificate No: " + certNumber, certFont);
        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, certNo, pageSize.getWidth() / 2, 62, 0);

        doc.close();
        return filePath;
    }

    private void addCenteredLogo(Document doc, Rectangle pageSize) throws Exception {
        Path logoPath = Path.of(uploadDir, "certificate-logos.png");
        if (!Files.exists(logoPath)) {
            return;
        }

        Image logos = Image.getInstance(logoPath.toAbsolutePath().toString());
        logos.scaleToFit(175, 70);
        logos.setAbsolutePosition((pageSize.getWidth() - logos.getScaledWidth()) / 2, pageSize.getHeight() - 104);
        doc.add(logos);
    }

    private void drawCertificateBackground(PdfContentByte canvas, Rectangle pageSize) {
        float width = pageSize.getWidth();
        float height = pageSize.getHeight();
        BaseColor navy = new BaseColor(30, 60, 95);
        BaseColor gold = new BaseColor(244, 190, 37);

        canvas.setColorStroke(BaseColor.BLACK);
        canvas.setLineWidth(1.5f);
        canvas.rectangle(4, 4, width - 8, height - 8);
        canvas.stroke();

        canvas.setColorFill(navy);
        canvas.moveTo(4, height - 4);
        canvas.lineTo(445, height - 4);
        canvas.lineTo(520, height - 36);
        canvas.lineTo(4, height - 36);
        canvas.closePath();
        canvas.fill();

        canvas.setColorFill(gold);
        canvas.moveTo(4, height - 4);
        canvas.lineTo(145, height - 4);
        canvas.lineTo(4, height - 36);
        canvas.closePath();
        canvas.fill();

        canvas.setColorFill(navy);
        canvas.moveTo(width - 195, height - 4);
        canvas.lineTo(width - 4, height - 4);
        canvas.lineTo(width - 4, height - 175);
        canvas.closePath();
        canvas.fill();

        canvas.setColorFill(gold);
        canvas.moveTo(width - 155, height - 4);
        canvas.lineTo(width - 4, height - 4);
        canvas.lineTo(width - 4, height - 112);
        canvas.closePath();
        canvas.fill();

        canvas.setColorFill(navy);
        canvas.moveTo(4, 4);
        canvas.lineTo(390, 4);
        canvas.lineTo(320, 36);
        canvas.lineTo(4, 36);
        canvas.closePath();
        canvas.fill();

        canvas.setColorFill(gold);
        canvas.moveTo(4, 4);
        canvas.lineTo(185, 4);
        canvas.lineTo(4, 180);
        canvas.closePath();
        canvas.fill();

        canvas.setColorFill(navy);
        canvas.moveTo(width - 4, 4);
        canvas.lineTo(width - 440, 4);
        canvas.lineTo(width - 360, 36);
        canvas.lineTo(width - 4, 36);
        canvas.closePath();
        canvas.fill();

        canvas.setColorFill(gold);
        canvas.moveTo(width - 4, 4);
        canvas.lineTo(width - 150, 4);
        canvas.lineTo(width - 4, 34);
        canvas.closePath();
        canvas.fill();
    }

    private void drawSignature(PdfContentByte canvas, String name, String role, float centerX, float y) {
        Font nameFont = new Font(Font.FontFamily.HELVETICA, 13, Font.BOLD, BaseColor.BLACK);
        Font roleFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.BLACK);
        Font signFont = new Font(Font.FontFamily.HELVETICA, 18, Font.ITALIC, BaseColor.DARK_GRAY);

        Phrase sign = new Phrase(name, signFont);
        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, sign, centerX, y + 34, 0);

        canvas.setColorStroke(BaseColor.BLACK);
        canvas.setLineWidth(0.8f);
        canvas.moveTo(centerX - 85, y + 24);
        canvas.lineTo(centerX + 85, y + 24);
        canvas.stroke();

        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, new Phrase(name, nameFont), centerX, y + 6, 0);
        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, new Phrase(role, roleFont), centerX, y - 12, 0);
    }

    private CertificateResponse toResponse(Certificate c) {
        CertificateResponse res = new CertificateResponse();
        res.setId(c.getId());
        res.setStudentId(c.getStudent().getId());
        res.setStudentName(c.getStudent().getFullName());
        res.setStudentCollegeId(c.getStudent().getCollegeId());
        res.setEventId(c.getEvent().getId());
        res.setEventTitle(c.getEvent().getTitle());
        res.setStatus(c.getStatus());
        res.setCertificateNumber(c.getCertificateNumber());
        res.setGeneratedAt(c.getGeneratedAt());
        res.setVerifiedAt(c.getVerifiedAt());
        return res;
    }
}
