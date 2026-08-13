package com.campusconnect.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class CertificateGenerationRequest {
    private List<Long> studentIds;
}
