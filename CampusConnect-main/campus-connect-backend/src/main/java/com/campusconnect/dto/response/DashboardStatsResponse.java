package com.campusconnect.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class DashboardStatsResponse {
    private long totalEvents;
    private long pendingEvents;
    private long approvedEvents;
    private long totalUsers;
    private long totalStudents;
    private long totalOrganizers;
    private long pendingMedia;
    private long pendingCertificates;
    private long totalRegistrations;
}
