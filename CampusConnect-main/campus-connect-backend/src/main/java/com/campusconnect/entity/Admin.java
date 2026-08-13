package com.campusconnect.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@DiscriminatorValue("ADMIN")
@Getter @Setter @NoArgsConstructor
public class Admin extends User {

    @Column(unique = true, length = 20)
    private String adminCode;
}
