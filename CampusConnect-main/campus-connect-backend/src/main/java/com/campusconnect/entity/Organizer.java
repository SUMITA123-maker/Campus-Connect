package com.campusconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "organizers")
@DiscriminatorValue("ORGANIZER")
@Getter @Setter @NoArgsConstructor
public class Organizer extends User {

    @Column(length = 100)
    private String department;

    @Column(length = 15)
    private String contactPhone;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Event> events = new ArrayList<>();
}
